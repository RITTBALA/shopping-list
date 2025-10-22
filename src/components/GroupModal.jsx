import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

const GroupModal = ({ open, onClose, onSave, group = null }) => {
  const [groupName, setGroupName] = useState('');
  const [memberUids, setMemberUids] = useState([]);
  const [memberEmails, setMemberEmails] = useState({}); // Map uid -> email for display
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (group) {
      setGroupName(group.groupName);
      setMemberUids(group.memberUids || []);
      // Fetch member emails
      fetchMemberEmails(group.memberUids || []);
    } else {
      setGroupName('');
      // For new groups, automatically include the current user as owner
      if (currentUser) {
        setMemberUids([currentUser.uid]);
        setMemberEmails({ [currentUser.uid]: currentUser.email });
      } else {
        setMemberUids([]);
        setMemberEmails({});
      }
    }
    setNewMemberEmail('');
    setError('');
  }, [group, open, currentUser]);

  const fetchMemberEmails = async (uids) => {
    const emails = {};
    for (const uid of uids) {
      const usersQuery = query(collection(db, 'users'), where('uid', '==', uid));
      const snapshot = await getDocs(usersQuery);
      if (!snapshot.empty) {
        emails[uid] = snapshot.docs[0].data().email;
      }
    }
    setMemberEmails(emails);
  };

  const handleAddMember = async () => {
    setError('');
    if (!newMemberEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      // Find user by email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', newMemberEmail.trim().toLowerCase())
      );
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        setError('User not found with this email');
        return;
      }

      const userData = snapshot.docs[0].data();
      const uid = userData.uid;

      // Check if already a member
      if (memberUids.includes(uid)) {
        setError('User is already a member');
        return;
      }

      // Add to members
      const newUids = [...memberUids, uid];
      setMemberUids(newUids);
      setMemberEmails({ ...memberEmails, [uid]: userData.email });
      setNewMemberEmail('');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    }
  };

  const handleRemoveMember = (uid) => {
    // Don't allow removing the owner (current user) from new groups
    if (!group && currentUser && uid === currentUser.uid) {
      setError('You cannot remove yourself from the group');
      return;
    }
    // Don't allow removing the owner from existing groups
    if (group && uid === group.ownerId) {
      setError('Cannot remove the group owner');
      return;
    }
    
    setMemberUids(memberUids.filter(id => id !== uid));
    const newEmails = { ...memberEmails };
    delete newEmails[uid];
    setMemberEmails(newEmails);
    setError('');
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (memberUids.length === 0) {
      setError('Group must have at least one member');
      return;
    }

    onSave({
      groupName: groupName.trim(),
      memberUids
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        👥 {group ? 'Edit Group' : 'Create New Group'}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
          Members ({memberUids.length})
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            label="Add member by email"
            fullWidth
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddMember();
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleAddMember}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <List sx={{ maxHeight: 200, overflow: 'auto' }}>
          {memberUids.map((uid) => {
            const isOwner = group ? uid === group.ownerId : uid === currentUser?.uid;
            return (
              <ListItem
                key={uid}
                secondaryAction={
                  !isOwner && (
                    <IconButton edge="end" onClick={() => handleRemoveMember(uid)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                }}
              >
                <ListItemText
                  primary={memberEmails[uid] || uid}
                  secondary={isOwner ? 'Owner' : 'Member'}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          {group ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupModal;
