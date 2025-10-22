import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PaletteIcon from '@mui/icons-material/Palette';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { subscribeToUserLists } from '../firebase/firestoreService';
import CreateListDialog from '../components/CreateListDialog';
import ListCard from '../components/ListCard';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@admin.com';

const DashboardPage = () => {
  const [lists, setLists] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 = Active, 1 = Archived
  const [openDialog, setOpenDialog] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { currentUser, logoutUser } = useAuth();
  const { currentTheme, isDarkMode } = useCustomTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to lists in real-time
    const unsubscribe = subscribeToUserLists(currentUser.uid, (fetchedLists) => {
      setLists(fetchedLists);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const activeLists = lists.filter(list => list.status === 'active');
  const archivedLists = lists.filter(list => list.status === 'archived');
  const displayedLists = tabValue === 0 ? activeLists : archivedLists;

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: currentTheme.gradient,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🛒 My Shopping Lists
          </Typography>
          <Typography variant="body1" sx={{ mr: 2, opacity: 0.9 }}>
            {currentUser?.displayName || currentUser?.email}
          </Typography>
          {currentUser?.email === ADMIN_EMAIL && (
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/admin')} 
              title="Admin Panel"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                mr: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/settings')} 
            title="Settings"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              mr: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={handleLogout} 
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

      <Box sx={{ 
        bgcolor: isDarkMode ? '#1a1a2e' : '#f8f9fa', 
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            pt: { xs: 2, sm: 3, md: 4 }, 
            pb: { xs: 2, sm: 3, md: 4 }, 
            px: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
          }}
        >
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: { xs: 2, sm: 3 },
            bgcolor: isDarkMode ? '#16213e' : 'white',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'background-color 0.3s ease',
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              aria-label="list tabs"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                },
                '& .Mui-selected': {
                  color: currentTheme.primary,
                }
              }}
            >
              <Tab label={`✅ Active (${activeLists.length})`} />
              <Tab label={`📦 Archived (${archivedLists.length})`} />
            </Tabs>
          </Box>

          {displayedLists.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                p: 4
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                {tabValue === 0 ? '📝' : '📦'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {tabValue === 0
                  ? 'No active lists. Create your first shopping list!'
                  : 'No archived lists.'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {displayedLists.map((list) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={list.id}>
                  <ListCard list={list} />
                </Grid>
              ))}
            </Grid>
          )}

          <SpeedDial
            ariaLabel="Dashboard actions"
            sx={{
              position: 'fixed',
              bottom: { xs: 16, sm: 20, md: 24 },
              right: { xs: 16, sm: 20, md: 24 },
              '& .MuiFab-primary': {
                background: currentTheme.gradient,
                boxShadow: `0 4px 12px ${currentTheme.primary}66`,
                '&:hover': {
                  background: currentTheme.gradient,
                  boxShadow: `0 6px 16px ${currentTheme.primary}99`,
                },
              },
            }}
            icon={<MoreVertIcon />}
            onClose={() => setSpeedDialOpen(false)}
            onOpen={() => setSpeedDialOpen(true)}
            open={speedDialOpen}
            direction="up"
          >
            <SpeedDialAction
              icon={<AddIcon />}
              tooltipTitle="Add List"
              onClick={() => {
                setOpenDialog(true);
                setSpeedDialOpen(false);
              }}
              sx={{
                '& .MuiSpeedDialAction-fab': {
                  background: currentTheme.gradient,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                },
              }}
            />
            <SpeedDialAction
              icon={<GroupIcon />}
              tooltipTitle="Manage Groups"
              onClick={() => {
                navigate('/groups');
                setSpeedDialOpen(false);
              }}
              sx={{
                '& .MuiSpeedDialAction-fab': {
                  background: currentTheme.gradient,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                },
              }}
            />
            <SpeedDialAction
              icon={<PaletteIcon />}
              tooltipTitle="Change Theme"
              onClick={() => {
                setShowThemePicker(true);
                setSpeedDialOpen(false);
              }}
              sx={{
                '& .MuiSpeedDialAction-fab': {
                  background: currentTheme.gradient,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                },
              }}
            />
          </SpeedDial>

          <CreateListDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />

          {showThemePicker && (
            <ThemeSwitcher 
              open={showThemePicker}
              onClose={() => setShowThemePicker(false)}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
