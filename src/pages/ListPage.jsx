import { useState, useEffect } from 'react';
import { Container, Box, Menu, MenuItem, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { archiveList, reactivateList, deleteListWithItems } from '../firebase/firestoreService';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import ListHeader from '../components/ListHeader';
import AddItemForm from '../components/AddItemForm';
import ItemList from '../components/ItemList';
import ShareListDialog from '../components/ShareListDialog';
import RenameListDialog from '../components/RenameListDialog';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';

const ListPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { currentTheme, isDarkMode } = useCustomTheme();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const fetchList = async () => {
    try {
      const listDoc = await getDoc(doc(db, 'lists', listId));
      if (listDoc.exists()) {
        setList({ id: listDoc.id, ...listDoc.data() });
      } else {
        console.error('List not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listId) {
      fetchList();
    }
  }, [listId, navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = async () => {
    try {
      if (list.status === 'active') {
        await archiveList(list.id);
      } else {
        await reactivateList(list.id);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this list? This will also delete all items in the list. This action cannot be undone.')) {
      try {
        await deleteListWithItems(list.id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Failed to delete list. Please try again.');
      }
    }
    handleMenuClose();
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleRename = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameClose = (success) => {
    setRenameDialogOpen(false);
    if (success) {
      // Refresh the list to show the new name
      fetchList();
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: currentTheme.gradient,
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!list) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: currentTheme.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
            List not found
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: currentTheme.gradient,
      transition: 'background 0.3s ease',
    }}>
      <ListHeader 
        list={list} 
        onShare={handleShare}
        onRename={handleRename}
        onMenuClick={handleMenuOpen}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
        }}
      >
        <AddItemForm listId={listId} />
        <ItemList listId={listId} />
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 1,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          }
        }}
      >
        <MenuItem 
          onClick={handleArchive}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
            },
          }}
        >
          {list.status === 'active' ? (
            <>
              <ArchiveIcon sx={{ mr: 1.5, color: '#667eea' }} fontSize="small" />
              Archive List
            </>
          ) : (
            <>
              <UnarchiveIcon sx={{ mr: 1.5, color: '#667eea' }} fontSize="small" />
              Unarchive List
            </>
          )}
        </MenuItem>
        <MenuItem 
          onClick={handleDelete}
          sx={{
            py: 1.5,
            px: 2,
            color: '#ef4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1.5 }} fontSize="small" />
          Delete List
        </MenuItem>
      </Menu>

      <ShareListDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        list={list}
      />

      <RenameListDialog
        open={renameDialogOpen}
        onClose={handleRenameClose}
        list={list}
      />
    </Box>
  );
};

export default ListPage;
