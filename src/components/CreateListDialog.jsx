import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Alert,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { createList, getGroup, getUserByEmail } from '../firebase/firestoreService';
import GroupPicker from './GroupPicker';

const ICON_OPTIONS = [
  { value: 'ShoppingCart', label: 'Shopping Cart', icon: Icons.ShoppingCart },
  { value: 'LocalGroceryStore', label: 'Grocery Store', icon: Icons.LocalGroceryStore },
  { value: 'Restaurant', label: 'Restaurant', icon: Icons.Restaurant },
  { value: 'Fastfood', label: 'Fast Food', icon: Icons.Fastfood },
  { value: 'Home', label: 'Home', icon: Icons.Home },
  { value: 'Work', label: 'Work', icon: Icons.Work },
  { value: 'Favorite', label: 'Favorite', icon: Icons.Favorite },
  { value: 'Star', label: 'Star', icon: Icons.Star },
];

const COLOR_OPTIONS = [
  { value: '#FFE5E5', label: 'Soft Coral' },
  { value: '#E8F4FD', label: 'Sky Blue' },
  { value: '#E8F8F5', label: 'Mint Green' },
  { value: '#FFF4E6', label: 'Peach' },
  { value: '#F3E5F5', label: 'Lavender' },
  { value: '#FCE4EC', label: 'Rose' },
  { value: '#E0F2F1', label: 'Teal' },
  { value: '#FFF9C4', label: 'Lemon' },
  { value: '#F1F8E9', label: 'Lime' },
  { value: '#EDE7F6', label: 'Violet' },
  { value: '#E1F5FE', label: 'Ice Blue' },
  { value: '#FBE9E7', label: 'Apricot' },
];

const CreateListDialog = ({ open, onClose }) => {
  const [listName, setListName] = useState('');
  const [icon, setIcon] = useState('ShoppingCart');
  const [color, setColor] = useState('#E8F4FD');
  const [selectedGroup, setSelectedGroup] = useState('just-me');
  const [location, setLocation] = useState('');
  const [shareMode, setShareMode] = useState(0); // 0 = Group, 1 = Individual
  const [individualMembers, setIndividualMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { currentTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }

    setLoading(true);

    try {
      let members = [currentUser.uid]; // Default to just the current user
      let linkedGroupId = null; // Track if list is linked to a group

      // Determine members based on share mode
      if (shareMode === 0) {
        // Group mode
        if (selectedGroup !== 'just-me') {
          const group = await getGroup(selectedGroup);
          if (group && group.memberUids) {
            members = group.memberUids;
            linkedGroupId = selectedGroup; // Link the list to this group
          }
        }
      } else {
        // Individual mode
        if (individualMembers.length > 0) {
          members = [currentUser.uid, ...individualMembers.map(m => m.uid)];
        }
      }

      await createList(
        {
          listName: listName.trim(),
          icon,
          color,
          location: location.trim(),
          members, // Pass the members array
          linkedGroupId, // Pass the linked group ID
        },
        currentUser.uid
      );
      
      // Reset form and close dialog
      setListName('');
      setIcon('ShoppingCart');
      setColor('#E8F4FD');
  setSelectedGroup('just-me');
  setLocation('');
      setIndividualMembers([]);
      setNewMemberEmail('');
      setShareMode(0);
      onClose();
    } catch (err) {
      setError('Failed to create list. Please try again.');
      console.error('Error creating list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndividualMember = async () => {
    setError('');
    
    if (!newMemberEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (newMemberEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      setError('You are already added to this list');
      setNewMemberEmail('');
      return;
    }

    try {
      const user = await getUserByEmail(newMemberEmail.trim());
      
      if (!user) {
        setError('User not found with this email');
        return;
      }

      if (individualMembers.some(m => m.uid === user.uid)) {
        setError('User is already added');
        return;
      }

      setIndividualMembers([...individualMembers, { uid: user.uid, email: user.email }]);
      setNewMemberEmail('');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    }
  };

  const handleRemoveIndividualMember = (uid) => {
    setIndividualMembers(individualMembers.filter(m => m.uid !== uid));
  };

  const handleClose = () => {
    if (!loading) {
      setListName('');
      setIcon('ShoppingCart');
      setColor('#E8F4FD');
      setSelectedGroup('just-me');
      setIndividualMembers([]);
      setNewMemberEmail('');
      setShareMode(0);
      setError('');
      onClose();
    }
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
          background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
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
          Create New Shopping List
        </DialogTitle>
        <DialogContent>
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
            margin="normal"
            label="List Name"
            type="text"
            fullWidth
            required
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g., Weekly Groceries"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                '& fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.primary,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
              },
              '& .MuiInputBase-input': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
              },
            }}
          />

          <TextField
            margin="normal"
            label="Store Location (address or coordinates)"
            type="text"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 123 Main St, City or 47.4979, 19.0402"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                '& fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.primary,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
              },
              '& .MuiInputBase-input': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
              },
            }}
          />

          <FormControl 
            fullWidth 
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                '& fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.primary,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
              },
              '& .MuiSelect-select': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
              },
              '& .MuiSvgIcon-root': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
              },
            }}
          >
            <InputLabel>Icon</InputLabel>
            <Select
              value={icon}
              label="Icon"
              onChange={(e) => setIcon(e.target.value)}
            >
              {ICON_OPTIONS.map((option) => {
                const IconComp = option.icon;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconComp sx={{ mr: 1, color: currentTheme.primary }} />
                      {option.label}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Share Mode Tabs */}
          <Box sx={{ mt: 3, mb: 2 }}>
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
                  fontWeight: '600',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  color: currentTheme.isDark ? currentTheme.textSecondary : '#666',
                  '&.Mui-selected': {
                    color: currentTheme.primary,
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                },
              }}
            >
              <Tab label="Share with Group" />
              <Tab label="Share with Individuals" />
            </Tabs>
          </Box>

          {/* Group Mode */}
          {shareMode === 0 && (
            <GroupPicker 
              value={selectedGroup}
              onChange={setSelectedGroup}
            />
          )}

          {/* Individual Mode */}
          {shareMode === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ 
                  fontWeight: '600',
                  color: currentTheme.isDark ? currentTheme.textColor : '#333',
                  mb: 1.5,
                }}
              >
                Add People by Email
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  label="Email address"
                  fullWidth
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIndividualMember();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                      '& fieldset': {
                        borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: currentTheme.primary,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
                    },
                    '& .MuiInputBase-input': {
                      color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddIndividualMember}
                  sx={{
                    background: currentTheme.gradient,
                    color: 'white',
                    borderRadius: '12px',
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {individualMembers.length > 0 && (
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#666',
                      fontWeight: '600',
                    }}
                  >
                    Added members ({individualMembers.length})
                  </Typography>
                  <List sx={{ maxHeight: 150, overflow: 'auto', mt: 1 }}>
                    {individualMembers.map((member) => (
                      <ListItem
                        key={member.uid}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveIndividualMember(member.uid)}
                            sx={{
                              color: '#ef5350',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        sx={{
                          borderRadius: '12px',
                          mb: 1,
                          bgcolor: 'white',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                        }}
                      >
                        <ListItemText primary={member.email} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {individualMembers.length === 0 && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    py: 3,
                    color: '#999',
                    fontStyle: 'italic',
                  }}
                >
                  No members added. The list will only be visible to you.
                </Typography>
              )}
            </Box>
          )}

          <Typography 
            variant="subtitle2" 
            sx={{ 
              mt: 3,
              mb: 1.5,
              fontWeight: '600',
              color: currentTheme.isDark ? currentTheme.textColor : '#333',
            }}
          >
            Color Theme
          </Typography>
          <Grid container spacing={1.5}>
            {COLOR_OPTIONS.map((option) => (
              <Grid item key={option.value}>
                <Paper
                  elevation={color === option.value ? 8 : 2}
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: option.value,
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: color === option.value ? `3px solid ${currentTheme.primary}` : '2px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.15)',
                      boxShadow: `0 4px 12px ${currentTheme.primary}33`,
                    },
                  }}
                  onClick={() => setColor(option.value)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
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
            type="submit" 
            variant="contained" 
            disabled={loading}
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
            {loading ? 'Creating...' : 'Create List'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateListDialog;
