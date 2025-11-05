import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockResetIcon from '@mui/icons-material/LockReset';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const { currentTheme, isDarkMode } = useCustomTheme();
  const [deleting, setDeleting] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [navigationApp, setNavigationApp] = useState('google'); // 'google' or 'waze'

  // Load navigation preference from localStorage
  useEffect(() => {
    const savedApp = localStorage.getItem('navigationApp') || 'google';
    setNavigationApp(savedApp);
  }, []);

  // Save navigation preference to localStorage
  const handleNavigationAppChange = (app) => {
    setNavigationApp(app);
    localStorage.setItem('navigationApp', app);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'This will permanently delete your account and all your data.\n\nType "DELETE" to confirm:'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    setDeleting(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        // Note: In a production app, you'd also want to delete user data from Firestore
        // This would ideally be done via Cloud Functions
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        alert('For security, you need to log out and log back in before deleting your account.');
      } else {
        alert('Failed to delete account. Please try again.');
      }
      setDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const user = auth.currentUser;
      
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      alert('Password changed successfully!');
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak');
      } else {
        setPasswordError('Failed to change password: ' + error.message);
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: currentTheme.isDark ? currentTheme.backgroundColor : currentTheme.gradient,
      transition: 'background 0.3s ease',
    }}>
      <AppBar 
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ 
              mr: 2,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'white',
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            ⚙️ Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="md" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: 4, 
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4 },
            background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: currentTheme.isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' : '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
            border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{
              mb: 1,
              background: currentTheme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Account Settings
          </Typography>
          <Typography variant="body2" sx={{ 
            mb: 3,
            color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
          }}>
            Manage your account preferences and security
          </Typography>

          <Divider sx={{ 
            my: 3,
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
          }} />

          <List sx={{ mb: 2 }}>
            <ListItem 
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  backgroundColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '0.85rem',
                    color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
                  }}>
                    📧 Email
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    mt: 0.5,
                    color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                  }}>
                    {currentUser?.email}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem 
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  backgroundColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '0.85rem',
                    color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
                  }}>
                    👤 Display Name
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    mt: 0.5,
                    color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                  }}>
                    {currentUser?.displayName || 'Not set'}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem 
              sx={{ 
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '0.85rem',
                    color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
                  }}>
                    📅 Account Created
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    mt: 0.5,
                    color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                  }}>
                    {currentUser?.metadata?.creationTime || 'Unknown'}
                  </Typography>
                }
              />
            </ListItem>
          </List>

          <Divider sx={{ 
            my: 3,
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
          }} />

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: currentTheme.isDark ? currentTheme.textColor : '#667eea',
            }}
          >
            📍 Navigation
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
            }}
          >
            Choose your preferred navigation app for getting directions to list locations
          </Typography>

          <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={navigationApp}
              exclusive
              onChange={(e, newApp) => newApp && handleNavigationAppChange(newApp)}
              sx={{
                gap: 2,
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.3)',
                  color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                  '&.Mui-selected': {
                    background: currentTheme.gradient,
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      background: currentTheme.gradient,
                      filter: 'brightness(0.95)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)',
                  },
                },
              }}
            >
              <ToggleButton value="google">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src="https://www.google.com/images/branding/product/1x/maps_32dp.png"
                    alt="Google Maps"
                    sx={{ width: 20, height: 20 }}
                  />
                </Box>
                Google Maps
              </ToggleButton>
              <ToggleButton value="waze">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00d8ff 0%, #0088ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    boxShadow: '0 2px 8px rgba(0, 136, 255, 0.3)',
                  }}
                >
                  <Box
                    component="img"
                    src="/waze-icon.svg"
                    alt="Waze"
                    sx={{ width: 20, height: 20 }}
                  />
                </Box>
                Waze
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ 
            my: 3,
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
          }} />

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: currentTheme.isDark ? currentTheme.textColor : '#667eea',
            }}
          >
            🔒 Security
          </Typography>

          <Box sx={{ mt: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={() => setChangePasswordOpen(true)}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: currentTheme.primary,
                color: currentTheme.primary,
                fontWeight: 600,
                '&:hover': {
                  borderColor: currentTheme.primary,
                  backgroundColor: `${currentTheme.primary}15`,
                },
              }}
            >
              Change Password
            </Button>
          </Box>

          <Divider sx={{ 
            my: 3,
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
          }} />

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: currentTheme.isDark ? currentTheme.textColor : '#667eea',
            }}
          >
            ⚡ Actions
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: currentTheme.primary,
                color: currentTheme.primary,
                fontWeight: 600,
                '&:hover': {
                  borderColor: currentTheme.primary,
                  backgroundColor: `${currentTheme.primary}15`,
                },
              }}
            >
              Logout
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteForeverIcon />}
              onClick={handleDeleteAccount}
              disabled={deleting}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: '#ef4444',
                color: '#ef4444',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                },
                '&:disabled': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {deleting ? 'Deleting Account...' : 'Delete Account'}
            </Button>
          </Box>

          <Typography 
            variant="caption" 
            sx={{ 
              mt: 3, 
              display: 'block',
              p: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              borderLeft: '4px solid #ef4444',
            }}
          >
            ⚠️ Warning: Deleting your account is permanent and cannot be undone.
            All your lists and data will be lost.
          </Typography>
        </Paper>
      </Container>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.98)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          background: currentTheme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🔐 Change Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                  '& fieldset': {
                    borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: currentTheme.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
                  '&.Mui-focused': {
                    color: currentTheme.primary,
                  },
                },
                '& .MuiInputBase-input': {
                  color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="At least 6 characters"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                  '& fieldset': {
                    borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: currentTheme.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
                  '&.Mui-focused': {
                    color: currentTheme.primary,
                  },
                },
                '& .MuiInputBase-input': {
                  color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                },
                '& .MuiFormHelperText-root': {
                  color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                  '& fieldset': {
                    borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: currentTheme.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
                  '&.Mui-focused': {
                    color: currentTheme.primary,
                  },
                },
                '& .MuiInputBase-input': {
                  color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                },
              }}
            />
            {passwordError && (
              <Typography 
                sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '0.9rem',
                }}
              >
                ⚠️ {passwordError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setChangePasswordOpen(false);
              setPasswordError('');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            sx={{
              borderRadius: '10px',
              px: 3,
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            sx={{
              borderRadius: '10px',
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
              },
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
