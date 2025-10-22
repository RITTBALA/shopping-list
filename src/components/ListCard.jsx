import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveList, reactivateList, deleteListWithItems } from '../firebase/firestoreService';

const ListCard = ({ list }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = async (event) => {
    event.stopPropagation();
    try {
      if (list.status === 'active') {
        await archiveList(list.id);
      } else {
        await reactivateList(list.id);
      }
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
    handleMenuClose();
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list? This will also delete all items in the list. This action cannot be undone.')) {
      try {
        await deleteListWithItems(list.id);
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Failed to delete list. Please try again.');
      }
    }
    handleMenuClose();
  };

  const handleCardClick = () => {
    navigate(`/list/${list.id}`);
  };

  // Get the icon component
  const IconComponent = Icons[list.icon] || Icons.ShoppingCart;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        backgroundColor: list.color || '#ffffff',
        minHeight: { xs: 120, sm: 140 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0,0,0,0.05)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
          transform: 'translateY(-4px)',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 1 } }}>
          <Box
            sx={{
              mr: { xs: 1, sm: 1.5 },
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconComponent 
              sx={{ 
                fontSize: { xs: 28, sm: 36 },
                color: '#667eea'
              }} 
            />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {list.listName}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: '500'
          }}
        >
          👥 {list.members?.length || 0} member{list.members?.length !== 1 ? 's' : ''}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          📅 {list.createdAt?.toDate().toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1 }}>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          aria-label="settings"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            '&:hover': {
              bgcolor: 'rgba(102, 126, 234, 0.1)'
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleArchive}>
            {list.status === 'active' ? (
              <>
                <ArchiveIcon sx={{ mr: 1 }} fontSize="small" />
                Archive
              </>
            ) : (
              <>
                <UnarchiveIcon sx={{ mr: 1 }} fontSize="small" />
                Unarchive
              </>
            )}
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

export default ListCard;
