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
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const GroupModal = ({ open, onClose, onSave, group = null }) => {
  const [groupName, setGroupName] = useState('');
  const [memberUids, setMemberUids] = useState([]);
  const [memberEmails, setMemberEmails] = useState({}); // Map uid -> email for display
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { currentTheme } = useTheme();

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: 'white',
        }
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: currentTheme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          pb: 1,
        }}
      >
        {group ? 'Edit Group' : 'Create New Group'}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: 'white',
              '& fieldset': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: currentTheme.primary,
                borderWidth: '2px',
              },
            },
          }}
        />

        <Typography 
          variant="subtitle2" 
          gutterBottom 
          sx={{ 
            fontWeight: '600',
            color: '#333',
            mt: 2,
            mb: 1.5,
          }}
        >
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'white',
                '& fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.primary,
                  borderWidth: '2px',
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleAddMember}
            sx={{
              background: currentTheme.gradient,
              color: 'white',
              borderRadius: '12px',
              '&:hover': {
                background: currentTheme.gradient,
                opacity: 0.9,
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <List sx={{ maxHeight: 200, overflow: 'auto' }}>
          {memberUids.map((uid) => {
            const isOwner = group ? uid === group.ownerId : uid === currentUser?.uid;
            return (
              <ListItem
                key={uid}
                secondaryAction={
                  !isOwner && (
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveMember(uid)}
                      sx={{
                        color: '#ef5350',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 83, 80, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  bgcolor: 'white',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <ListItemText
                  primary={memberEmails[uid] || uid}
                  secondary={isOwner ? 'Owner' : 'Member'}
                  primaryTypographyProps={{
                    sx: { fontWeight: '500' }
                  }}
                  secondaryTypographyProps={{
                    sx: { color: currentTheme.primary, fontWeight: '600', fontSize: '0.75rem' }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button 
          onClick={onClose}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '600',
            px: 3,
            color: '#333',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '600',
            px: 3,
            background: currentTheme.gradient,
            color: 'white',
            boxShadow: `0 4px 12px ${currentTheme.primary}33`,
            '&:hover': {
              opacity: 0.9,
              boxShadow: `0 6px 16px ${currentTheme.primary}4D`,
            },
          }}
        >
          {group ? 'Save Changes' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupModal;
