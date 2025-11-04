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
import MapIcon from '@mui/icons-material/Map';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteListWithItems, archiveList, reactivateList } from '../firebase/firestoreService';
import RenameListDialog from './RenameListDialog';
import ConfirmDialog from './ConfirmDialog';
import { useTheme } from '../context/ThemeContext';

const ListCard = ({ list }) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleRename = (event) => {
    event.stopPropagation();
    setRenameDialogOpen(true);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteListWithItems(list.id);
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list. Please try again.');
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

  // Safe defaults for list properties
  const icon = list?.icon || 'ShoppingCart';
  const color = list.color || '#E8F4FD';
  const listName = list?.listName || '';
  const location = list?.location || '';
  const members = Array.isArray(list?.members) ? list.members : [];
  const createdAt = list?.createdAt && typeof list.createdAt.toDate === 'function' ? list.createdAt.toDate() : null;

  // Get the icon component
  const IconComponent = Icons[icon] || Icons.ShoppingCart;

  // Open Google Maps for navigation
  const handleDirections = (event) => {
    event.stopPropagation();
    if (!location) return;
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  // Archive or unarchive the list
  const handleArchive = async (event) => {
    event.stopPropagation();
    try {
      if (list.status === 'active') {
        await archiveList(list.id);
      } else {
        await reactivateList(list.id);
      }
    } catch (error) {
      console.error('Error archiving/unarchiving list:', error);
      alert('Failed to archive/unarchive list. Please try again.');
    }
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
  backgroundColor: currentTheme.isDark ? currentTheme.cardBackground : color,
        minHeight: { xs: 120, sm: 140 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: currentTheme.isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: currentTheme.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        '&:hover': {
          boxShadow: currentTheme.isDark 
            ? `0 8px 24px ${currentTheme.primary}40`
            : '0 8px 24px rgba(102, 126, 234, 0.15)',
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
              bgcolor: currentTheme.isDark ? `${currentTheme.primary}20` : 'rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconComponent 
              sx={{ 
                fontSize: { xs: 28, sm: 36 },
                color: currentTheme.primary
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
              color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
            }}
          >
            {listName}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: '500',
            color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
          }}
        >
          👥 {members.length} member{members.length !== 1 ? 's' : ''}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
          }}
        >
          📅 {createdAt ? createdAt.toLocaleDateString() : ''}
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
            color: '#60a5fa',
            '&:hover': {
              bgcolor: 'rgba(96, 165, 250, 0.1)',
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleArchive}
          aria-label={list.status === 'active' ? 'archive' : 'unarchive'}
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            color: '#ff9800',
            '&:hover': {
              bgcolor: 'rgba(255, 152, 0, 0.1)',
            }
          }}
        >
          {list.status === 'active' ? (
            <ArchiveIcon fontSize="small" />
          ) : (
            <UnarchiveIcon fontSize="small" />
          )}
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDeleteClick}
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
        <IconButton
          size="small"
          onClick={handleDirections}
          aria-label="directions"
          sx={{
            minWidth: { xs: 40, sm: 48 },
            minHeight: { xs: 40, sm: 48 },
            color: '#4caf50',
            '&:hover': {
              bgcolor: 'rgba(76, 175, 80, 0.1)',
            }
          }}
          disabled={!location}
        >
          <MapIcon fontSize="small" />
        </IconButton>
      </CardActions>

      <RenameListDialog
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        list={list}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete List"
        message="Are you sure you want to delete this list? This will also delete all items in the list. This action cannot be undone."
        confirmText="Delete"
      />
    </Card>
  );
};

export default ListCard;
