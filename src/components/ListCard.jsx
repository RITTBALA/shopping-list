import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteListWithItems } from '../firebase/firestoreService';
import RenameListDialog from './RenameListDialog';
import { useTheme } from '../context/ThemeContext';

const ListCard = ({ list }) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleRename = (event) => {
    event.stopPropagation();
    setRenameDialogOpen(true);
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
  };

  const handleCardClick = () => {
    // Don't navigate if dialog is open
    if (renameDialogOpen) return;
    navigate(`/list/${list.id}`);
  };

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
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
          onClick={handleRename}
          aria-label="rename"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            '&:hover': {
              bgcolor: `${currentTheme.primary}15`,
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          aria-label="delete"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            color: '#f5576c',
            '&:hover': {
              bgcolor: 'rgba(245, 87, 108, 0.1)',
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>

      <RenameListDialog
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        list={list}
      />
    </Card>
  );
};

export default ListCard;
