import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { deleteListWithItems } from '../firebase/firestoreService';

const ADMIN_EMAIL = 'admin@admin.com';

const AdminPage = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [activeListsCount, setActiveListsCount] = useState(0);
  const [archivedListsCount, setArchivedListsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedListMembers, setSelectedListMembers] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (currentUser?.email !== ADMIN_EMAIL) {
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [currentUser, navigate]);

  const fetchAdminData = async () => {
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(user => !user.deleted && user.email !== ADMIN_EMAIL); // Filter out deleted users and admin
      console.log('Fetched users:', usersData);
      setUsers(usersData);

      // Get active user IDs
      const activeUserIds = usersData.map(user => user.id);

      // Fetch all lists
      const listsSnapshot = await getDocs(collection(db, 'lists'));
      const allListsData = listsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter lists to only include those with active creators OR active members
      const listsData = allListsData.filter(list => {
        const hasActiveCreator = activeUserIds.includes(list.creatorId);
        const hasActiveMember = list.members && list.members.some(memberId => activeUserIds.includes(memberId));
        return hasActiveCreator || hasActiveMember;
      });
      
      // Count active and archived lists
      let activeCount = 0;
      let archivedCount = 0;
      
      for (let i = 0; i < listsData.length; i++) {
        const list = listsData[i];
        console.log(`List "${list.name}": isArchived =`, list.isArchived, typeof list.isArchived);
        if (list.isArchived === true) {
          archivedCount++;
          console.log('  -> Counted as ARCHIVED');
        } else {
          activeCount++;
          console.log('  -> Counted as ACTIVE');
        }
      }
      
      console.log('===================');
      console.log('Total lists:', listsData.length);
      console.log('Active lists count:', activeCount);
      console.log('Archived lists count:', archivedCount);
      console.log('===================');
      
      setAllLists(listsData);
      setActiveListsCount(activeCount);
      setArchivedListsCount(archivedCount);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Error loading admin data. Check console for details.');
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId, listName) => {
    if (window.confirm(`Are you sure you want to delete the list "${listName}"? This will also delete all items.`)) {
      try {
        await deleteListWithItems(listId);
        alert('List deleted successfully!');
        // Refresh data
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Failed to delete list. Error: ' + error.message);
      }
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user "${userEmail}"? This will remove them from all lists and delete lists where they are the only member. This action cannot be undone.`)) {
      try {
        // Get all lists where this user is involved
        const userLists = allLists.filter(list => 
          list.creatorId === userId || list.members?.includes(userId)
        );

        for (const list of userLists) {
          const listRef = doc(db, 'lists', list.id);
          
          // Check if user is the only member (creator + members array)
          const allMembers = [list.creatorId, ...(list.members || [])];
          const uniqueMembers = [...new Set(allMembers)]; // Remove duplicates
          
          if (uniqueMembers.length === 1 && uniqueMembers[0] === userId) {
            // User is the only member, delete the entire list
            await deleteListWithItems(list.id);
          } else {
            // List has other members, just remove this user
            const updatedMembers = (list.members || []).filter(uid => uid !== userId);
            
            // If the deleted user was the creator, transfer ownership to the first remaining member
            if (list.creatorId === userId) {
              const newCreator = updatedMembers[0];
              await updateDoc(listRef, {
                creatorId: newCreator,
                members: updatedMembers
              });
            } else {
              // Just remove from members
              await updateDoc(listRef, {
                members: updatedMembers
              });
            }
          }
        }

        // Mark the user as deleted in Firestore (since we can't delete from Auth client-side)
        await updateDoc(doc(db, 'users', userId), {
          deleted: true,
          deletedAt: new Date().toISOString()
        });
        
        alert('User marked as deleted successfully! They will no longer be able to access the app.');
        // Refresh data
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Error: ' + error.message);
      }
    }
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.email || 'Unknown';
  };

  const getMemberEmails = (memberIds) => {
    if (!memberIds || memberIds.length === 0) return [];
    return memberIds.map(uid => {
      const user = users.find(u => u.id === uid);
      return user?.email || uid;
    });
  };

  const handleViewMembers = (memberIds) => {
    const emails = getMemberEmails(memberIds);
    setSelectedListMembers(emails);
    setMembersDialogOpen(true);
  };

  const getUserLists = (userId) => {
    return allLists.filter(list => list.members?.includes(userId));
  };

  if (loading) {
    return <Typography>Loading admin panel...</Typography>;
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1a1a2e' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🛡️ Admin Control Panel
          </Typography>
          <Chip 
            label="ADMIN" 
            color="error" 
            size="small" 
            sx={{ 
              mr: 2, 
              fontWeight: 'bold',
              bgcolor: '#ff4444',
              color: 'white'
            }} 
          />
          <IconButton 
            color="inherit" 
            onClick={async () => {
              await logoutUser();
              navigate('/login');
            }} 
            title="Logout"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="xl" sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 }, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
              System Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{users.length}</Typography>
                <Typography variant="body1">Total Users</Typography>
              </Paper>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  flex: 1,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {activeListsCount}
                </Typography>
                <Typography variant="body1">Active Lists</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  ({archivedListsCount} archived)
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e', mb: 3 }}>
              User Management
            </Typography>
          
          {users
            .filter(user => user.email !== ADMIN_EMAIL)
            .map((user) => {
              const userLists = getUserLists(user.id);
              return (
                <Accordion 
                  key={user.id}
                  sx={{
                    mb: 2,
                    '&:before': { display: 'none' },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: '#fafafa',
                      '&:hover': { bgcolor: '#f0f0f0' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Typography sx={{ flexGrow: 1, fontWeight: '500' }}>
                        📧 {user.email}
                      </Typography>
                      <Chip 
                        label={`${userLists.length} lists`} 
                        size="small" 
                        color="primary" 
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id, user.email);
                        }}
                        sx={{
                          bgcolor: '#ff4444',
                          '&:hover': { bgcolor: '#cc0000' }
                        }}
                      >
                        Delete User
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {userLists.length === 0 ? (
                      <Typography color="text.secondary">No lists</Typography>
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>List Name</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Members</TableCell>
                              <TableCell>Created</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userLists.map((list) => (
                              <TableRow key={list.id}>
                                <TableCell>{list.listName}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={list.status} 
                                    size="small"
                                    color={list.status === 'active' ? 'success' : 'default'}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={`${list.members?.length || 0} members`}
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewMembers(list.members)}
                                    sx={{ cursor: 'pointer' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {list.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                </TableCell>
                                <TableCell align="right">
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteList(list.id, list.listName)}
                                    sx={{
                                      bgcolor: '#ff6b6b',
                                      '&:hover': { bgcolor: '#ee5555' }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Paper>
        </Container>
      </Box>

      {/* Members Dialog */}
      <Dialog 
        open={membersDialogOpen} 
        onClose={() => setMembersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1a1a2e', color: 'white', fontWeight: 'bold' }}>
          👥 List Members
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            {selectedListMembers.map((email, idx) => (
              <ListItem 
                key={idx}
                sx={{
                  bgcolor: idx === 0 ? '#f0f7ff' : 'transparent',
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemText 
                  primary={email}
                  primaryTypographyProps={{
                    fontWeight: idx === 0 ? 'bold' : 'normal'
                  }}
                />
                {idx === 0 && (
                  <Chip label="Creator" size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPage;
