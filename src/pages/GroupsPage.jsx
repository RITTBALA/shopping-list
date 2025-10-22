import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { getGroupsForUser, createGroup, updateGroupMembers, deleteGroup } from '../firebase/firestoreService';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { currentUser } = useAuth();
  const { currentTheme } = useCustomTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = getGroupsForUser(currentUser.uid, (fetchedGroups) => {
      setGroups(fetchedGroups);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreateNew = () => {
    setSelectedGroup(null);
    setModalOpen(true);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleDelete = async (groupId) => {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  const handleSave = async (groupData) => {
    try {
      if (selectedGroup) {
        // Edit existing group
        await updateGroupMembers(selectedGroup.id, groupData.memberUids);
        // Note: We're not updating the name here - you can add that feature if needed
      } else {
        // Create new group
        const groupId = await createGroup(groupData.groupName, currentUser.uid);
        // If there are additional members besides the owner, update them
        if (groupData.memberUids && groupData.memberUids.length > 1) {
          await updateGroupMembers(groupId, groupData.memberUids);
        }
      }
      setModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Failed to save group');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ background: currentTheme.gradient }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/settings')}
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            My Groups
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            variant="outlined"
          >
            New Group
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 64px)', pb: 4 }}>
        <Container maxWidth="xl" sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          {groups.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                No groups yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create groups to easily share new lists with multiple people at once.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{
                  background: currentTheme.gradient,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                Create Your First Group
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {groups.map((group) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
                  <GroupCard 
                    group={group} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <GroupModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedGroup(null);
        }}
        onSave={handleSave}
        group={selectedGroup}
      />
    </>
  );
};

export default GroupsPage;
