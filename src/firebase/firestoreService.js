import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  getDoc,
  getDocs,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== LISTS ====================

/**
 * Create a new shopping list
 */
export const createList = async (listData, userId) => {
  try {
    const listRef = await addDoc(collection(db, 'lists'), {
      listName: listData.listName,
      icon: listData.icon,
      color: listData.color,
      location: listData.location || '', // New location field
      createdAt: serverTimestamp(),
      creatorId: userId,
      members: listData.members || [userId], // Use provided members or default to just creator
      linkedGroupId: listData.linkedGroupId || null, // Track if list is linked to a group
      status: 'active',
      isArchived: false
    });
    return listRef.id;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

/**
 * Subscribe to lists where user is a member
 */
export const subscribeToUserLists = (userId, callback) => {
  const q = query(
    collection(db, 'lists'),
    where('members', 'array-contains', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(lists);
  });
};

/**
 * Update a list
 */
export const updateList = async (listId, updates) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, updates);
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

/**
 * Archive a list (set status to 'archived')
 */
export const archiveList = async (listId) => {
  return updateList(listId, { status: 'archived', isArchived: true });
};

/**
 * Reactivate a list (set status to 'active')
 */
export const reactivateList = async (listId) => {
  return updateList(listId, { status: 'active', isArchived: false });
};

/**
 * Delete a list
 */
export const deleteList = async (listId) => {
  try {
    await deleteDoc(doc(db, 'lists', listId));
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

/**
 * Add a member to a list by email
 */
export const addMemberToList = async (listId, memberUid) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      members: arrayUnion(memberUid)
    });
  } catch (error) {
    console.error('Error adding member to list:', error);
    throw error;
  }
};

/**
 * Remove a member from a list
 */
export const removeMemberFromList = async (listId, memberUid) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      members: arrayRemove(memberUid)
    });
  } catch (error) {
    console.error('Error removing member from list:', error);
    throw error;
  }
};

/**
 * Link a list to a group and add all group members
 */
export const linkListToGroup = async (listId, groupId) => {
  try {
    const group = await getGroup(groupId);
    if (!group || !group.memberUids) {
      throw new Error('Group not found');
    }

    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      linkedGroupId: groupId,
      members: arrayUnion(...group.memberUids)
    });
  } catch (error) {
    console.error('Error linking list to group:', error);
    throw error;
  }
};

/**
 * Unlink a list from a group
 */
export const unlinkListFromGroup = async (listId) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      linkedGroupId: null
    });
  } catch (error) {
    console.error('Error unlinking list from group:', error);
    throw error;
  }
};

// ==================== ITEMS ====================

/**
 * Add an item to a list
 */
export const addItem = async (itemData, listId, userId) => {
  try {
    const itemRef = await addDoc(collection(db, 'items'), {
      itemName: itemData.itemName,
      quantity: itemData.quantity || '',
      unit: itemData.unit || '',
      isPurchased: false,
      listId: listId,
      addedBy: userId
    });
    return itemRef.id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

/**
 * Subscribe to items for a specific list
 */
export const subscribeToListItems = (listId, callback) => {
  const q = query(
    collection(db, 'items'),
    where('listId', '==', listId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(items);
  });
};

/**
 * Toggle item purchased status
 */
export const toggleItemPurchased = async (itemId, isPurchased) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, { isPurchased: !isPurchased });
  } catch (error) {
    console.error('Error toggling item:', error);
    throw error;
  }
};

/**
 * Delete an item
 */
export const deleteItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'items', itemId));
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// ==================== USERS ====================

/**
 * Create or update user document in Firestore
 */
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      uid: userId,
      ...userData
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Get user by email address
 */
export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * Get user by UID
 */
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      preferences: preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Delete list and all its items (cascade delete)
 */
export const deleteListWithItems = async (listId) => {
  try {
    // First, get all items for this list
    const itemsQuery = query(collection(db, 'items'), where('listId', '==', listId));
    const itemsSnapshot = await getDocs(itemsQuery);
    
    // Create a batch to delete all items
    const batch = writeBatch(db);
    
    itemsSnapshot.forEach((itemDoc) => {
      batch.delete(itemDoc.ref);
    });
    
    // Add the list deletion to the batch
    batch.delete(doc(db, 'lists', listId));
    
    // Commit all deletions
    await batch.commit();
  } catch (error) {
    console.error('Error deleting list with items:', error);
    throw error;
  }
};

// ==================== GROUPS ====================

/**
 * Get all groups owned by a user (real-time listener)
 */
export const getGroupsForUser = (userId, callback) => {
  const groupsQuery = query(
    collection(db, 'groups'),
    where('ownerId', '==', userId)
  );

  return onSnapshot(groupsQuery, (snapshot) => {
    const groups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(groups);
  }, (error) => {
    console.error('Error fetching groups:', error);
    callback([]);
  });
};

/**
 * Create a new group
 */
export const createGroup = async (groupName, ownerId) => {
  try {
    const groupRef = await addDoc(collection(db, 'groups'), {
      groupName,
      ownerId,
      memberUids: [ownerId], // Owner is automatically a member
      createdAt: serverTimestamp()
    });
    return groupRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

/**
 * Update group members
 */
export const updateGroupMembers = async (groupId, newMemberUids) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      memberUids: newMemberUids
    });
  } catch (error) {
    console.error('Error updating group members:', error);
    throw error;
  }
};

/**
 * Delete a group
 */
export const deleteGroup = async (groupId) => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

/**
 * Get a single group by ID
 */
export const getGroup = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    if (groupDoc.exists()) {
      return { id: groupDoc.id, ...groupDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
};
