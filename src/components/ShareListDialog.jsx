import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  TextField,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { getUserByEmail, addMemberToList, removeMemberFromList, getUserById, getGroup, linkListToGroup, unlinkListFromGroup } from '../firebase/firestoreService';
import { useAuth } from '../context/AuthContext';
import GroupPicker from './GroupPicker';

const ShareListDialog = ({ open, onClose, list }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [shareMode, setShareMode] = useState(0); // 0 = Individual, 1 = Group
  const [selectedGroup, setSelectedGroup] = useState('');
  const [linkedGroup, setLinkedGroup] = useState(null);
  const { currentUser } = useAuth();

  // Load member details when dialog opens
  useEffect(() => {
    if (open && list?.members) {
      loadMembers();
      loadLinkedGroup();
    }
  }, [open, list]);

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const memberPromises = list.members.map(uid => getUserById(uid));
      const memberData = await Promise.all(memberPromises);
      setMembers(memberData.filter(m => m !== null));
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadLinkedGroup = async () => {
    if (list?.linkedGroupId) {
      try {
        const group = await getGroup(list.linkedGroupId);
        setLinkedGroup(group);
      } catch (err) {
        console.error('Error loading linked group:', err);
      }
    } else {
      setLinkedGroup(null);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    if (email.toLowerCase() === currentUser.email.toLowerCase()) {
      setError('You are already a member of this list.');
      return;
    }

    // Prevent adding admin user
    if (email.toLowerCase() === 'admin@admin.com') {
      setError('Cannot add admin user to lists.');
      return;
    }

    setLoading(true);

    try {
      // Find user by email
      const user = await getUserByEmail(email.trim());

      if (!user) {
        setError('No user found with this email address.');
        setLoading(false);
        return;
      }

      // Check if already a member
      if (list.members.includes(user.uid)) {
        setError('This user is already a member of this list.');
        setLoading(false);
        return;
      }

      // Add to members
      await addMemberToList(list.id, user.uid);
      
      setSuccess(`Successfully shared with ${email}!`);
      setEmail('');
      
      // Reload members
      await loadMembers();
    } catch (err) {
      console.error('Error sharing list:', err);
      setError('Failed to share list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithGroup = async () => {
    setError('');
    setSuccess('');

    if (!selectedGroup) {
      setError('Please select a group.');
      return;
    }

    setLoading(true);

    try {
      // Use the new linkListToGroup function
      await linkListToGroup(list.id, selectedGroup);
      
      setSuccess('Successfully linked list to group! All current and future group members will have access.');
      setSelectedGroup('');
      await loadMembers();
    } catch (err) {
      console.error('Error sharing with group:', err);
      setError('Failed to share with group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberUid) => {
    if (memberUid === currentUser.uid) {
      setError('You cannot remove yourself from the list.');
      return;
    }

    if (list.creatorId === memberUid) {
      setError('Cannot remove the list creator.');
      return;
    }

    // Check if list is linked to a group
    if (list.linkedGroupId) {
      try {
        const group = await getGroup(list.linkedGroupId);
        if (group && group.memberUids && group.memberUids.includes(memberUid)) {
          setError('Cannot remove this member because they are part of the linked group. To remove them, either remove them from the group or unlink this list from the group.');
          return;
        }
      } catch (err) {
        console.error('Error checking group membership:', err);
      }
    }

    try {
      await removeMemberFromList(list.id, memberUid);
      setSuccess('Member removed successfully.');
      await loadMembers();
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member.');
    }
  };

  const handleUnlinkGroup = async () => {
    if (!window.confirm('Are you sure you want to unlink this list from the group? Current members will stay, but new group members won\'t be automatically added.')) {
      return;
    }

    try {
      await unlinkListFromGroup(list.id);
      setSuccess('List unlinked from group successfully.');
      setLinkedGroup(null);
      await loadLinkedGroup();
    } catch (err) {
      console.error('Error unlinking from group:', err);
      setError('Failed to unlink from group.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.98)',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700,
        fontSize: '1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        pb: 1,
      }}>
        🔗 Share "{list?.listName}"
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* Linked Group Info */}
        {linkedGroup && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: '1px solid rgba(102, 126, 234, 0.3)',
            }}
            action={
              <Button
                size="small"
                startIcon={<LinkOffIcon />}
                onClick={handleUnlinkGroup}
                sx={{
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                Unlink
              </Button>
            }
          >
            🔗 This list is linked to group "{linkedGroup.groupName}". Group members cannot be removed individually.
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* Share Mode Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={shareMode} 
            onChange={(e, newValue) => setShareMode(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                '&:focus': {
                  outline: 'none',
                },
              },
            }}
          >
            <Tab label="Share with Individual" icon={<PersonAddIcon />} iconPosition="start" />
            <Tab label="Share with Group" icon={<GroupAddIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Individual Share Mode */}
        {shareMode === 0 && (
          <Box component="form" onSubmit={handleShare} sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              💌 Enter the email address of the person you want to share this list with:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              size="medium"
              placeholder="friend@example.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !email.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
                whiteSpace: 'nowrap',
              }}
            >
              Add
            </Button>
          </Box>
          </Box>
        )}

        {/* Group Share Mode */}
        {shareMode === 1 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              👥 Select a group to share this list with all its members:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Box sx={{ flexGrow: 1 }}>
                <GroupPicker 
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                />
              </Box>
              <Button
                variant="contained"
                disabled={loading || !selectedGroup || selectedGroup === 'just-me'}
                startIcon={loading ? <CircularProgress size={20} /> : <GroupAddIcon />}
                onClick={handleShareWithGroup}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.9,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                  },
                  whiteSpace: 'nowrap',
                }}
              >
                Share
              </Button>
            </Box>
          </Box>
        )}

        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700,
            color: '#667eea',
            fontSize: '1rem',
          }}
        >
          👥 Members ({members.length})
        </Typography>

        {loadingMembers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#667eea' }} />
          </Box>
        ) : (
          <List dense sx={{ 
            backgroundColor: 'rgba(102, 126, 234, 0.03)',
            borderRadius: '12px',
            p: 1,
          }}>
            {members.map((member) => {
              const isFromGroup = linkedGroup?.memberUids?.includes(member.uid);
              return (
              <ListItem 
                key={member.uid}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {member.displayName || member.email}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                      {member.uid === list?.creatorId && (
                        <Chip 
                          label="Creator" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                          }} 
                        />
                      )}
                      {member.uid === currentUser.uid && (
                        <Chip 
                          label="You" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            backgroundColor: '#667eea',
                            color: 'white',
                          }} 
                        />
                      )}
                      {isFromGroup && (
                        <Chip 
                          label="From Group" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            backgroundColor: '#22c55e',
                            color: 'white',
                          }} 
                        />
                      )}
                    </Box>
                  }
                />
                {member.uid !== currentUser.uid && member.uid !== list?.creatorId && !isFromGroup && (
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveMember(member.uid)}
                    size="small"
                    sx={{ 
                      ml: 'auto',
                      color: '#ef4444',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            );
            })}
          </List>
        )}

        <Typography 
          variant="caption" 
          sx={{ 
            mt: 2, 
            display: 'block',
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
            color: 'text.secondary',
            borderLeft: '4px solid #667eea',
          }}
        >
          ℹ️ All members can view, add, and check off items on this list.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose}
          sx={{
            borderRadius: '10px',
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareListDialog;
