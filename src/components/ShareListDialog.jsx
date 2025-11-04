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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  const { currentTheme } = useTheme();

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g., user@example.com).');
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
      
      // Fetch updated list members from the database
      const listDoc = await getDoc(doc(db, 'lists', list.id));
      if (listDoc.exists()) {
        const updatedMembers = listDoc.data().members || [];
        const memberPromises = updatedMembers.map(uid => getUserById(uid));
        const memberData = await Promise.all(memberPromises);
        setMembers(memberData.filter(m => m !== null));
      }
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
      
      // Load the linked group info
      const group = await getGroup(selectedGroup);
      setLinkedGroup(group);
      
      // Fetch updated list members from the database
      const listDoc = await getDoc(doc(db, 'lists', list.id));
      if (listDoc.exists()) {
        const updatedMembers = listDoc.data().members || [];
        const memberPromises = updatedMembers.map(uid => getUserById(uid));
        const memberData = await Promise.all(memberPromises);
        setMembers(memberData.filter(m => m !== null));
      }
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
    try {
      await unlinkListFromGroup(list.id);
      setSuccess('List unlinked from group successfully.');
      // The linkedGroup will be cleared when the parent refreshes the list
      setLinkedGroup(null);
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
          background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.98)',
          border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700,
        fontSize: '1.5rem',
        background: currentTheme.gradient,
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
              backgroundColor: currentTheme.isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)',
              color: currentTheme.primary,
              border: `1px solid ${currentTheme.primary}50`,
            }}
            action={
              <Button
                size="small"
                startIcon={<LinkOffIcon />}
                onClick={handleUnlinkGroup}
                sx={{
                  color: currentTheme.primary,
                  '&:hover': {
                    backgroundColor: currentTheme.isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
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
              backgroundColor: currentTheme.isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
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
              backgroundColor: currentTheme.isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
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
              '& .MuiTabs-indicator': {
                background: currentTheme.gradient,
                height: '3px',
                borderRadius: '3px',
              },
              '& .MuiTab-root': {
                fontWeight: 'bold',
                color: currentTheme.isDark ? currentTheme.textSecondary : 'inherit',
                '&.Mui-selected': {
                  color: currentTheme.primary,
                },
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
            <Typography variant="body2" sx={{ mb: 2, color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary' }}>
              💌 Enter the email address of the person you want to share this list with:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              size="medium"
              placeholder="friend@example.com"
              inputProps={{
                autoComplete: 'email',
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                  '& fieldset': {
                    borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: currentTheme.primary,
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: currentTheme.isDark ? currentTheme.textSecondary : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: currentTheme.primary,
                },
                '& .MuiInputBase-input': {
                  color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
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
                background: currentTheme.gradient,
                boxShadow: `0 4px 15px 0 ${currentTheme.primary}66`,
                '&:hover': {
                  background: currentTheme.gradient,
                  boxShadow: `0 6px 20px 0 ${currentTheme.primary}80`,
                  filter: 'brightness(0.95)',
                },
                '&:disabled': {
                  background: currentTheme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                  color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
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
            <Typography variant="body2" sx={{ mb: 2, color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary' }}>
              👥 Select a group to share this list with all its members:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
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
                  height: '56px',
                  background: currentTheme.gradient,
                  boxShadow: `0 4px 15px 0 ${currentTheme.primary}66`,
                  '&:hover': {
                    background: currentTheme.gradient,
                    boxShadow: `0 6px 20px 0 ${currentTheme.primary}80`,
                    filter: 'brightness(0.95)',
                  },
                  '&:disabled': {
                    background: currentTheme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                    color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
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
            color: currentTheme.primary,
            fontSize: '1rem',
          }}
        >
          👥 Members ({members.length})
        </Typography>

        {loadingMembers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: currentTheme.primary }} />
          </Box>
        ) : (
          <List dense sx={{ 
            backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(102, 126, 234, 0.03)',
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
                    backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.08)',
                  },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600, color: currentTheme.isDark ? currentTheme.textColor : 'inherit' }}>
                      {member.displayName || member.email}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary' }}>
                        {member.email}
                      </Typography>
                      {member.uid === list?.creatorId && (
                        <Chip 
                          label="Creator" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            background: currentTheme.gradient,
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
                            backgroundColor: currentTheme.primary,
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
            backgroundColor: currentTheme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.05)',
            color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
            borderLeft: `4px solid ${currentTheme.primary}`,
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
            background: currentTheme.gradient,
            color: 'white',
            fontWeight: 600,
            boxShadow: `0 4px 15px 0 ${currentTheme.primary}66`,
            '&:hover': {
              background: currentTheme.gradient,
              boxShadow: `0 6px 20px 0 ${currentTheme.primary}80`,
              filter: 'brightness(0.95)',
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
