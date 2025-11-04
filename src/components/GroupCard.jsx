import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from './ConfirmDialog';

const GroupCard = ({ group, onEdit, onDelete }) => {
  const { currentTheme } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    onDelete(group.id);
  };

  return (
    <Card
      onClick={() => onEdit(group)}
      sx={{
        minHeight: { xs: 140, sm: 160 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: currentTheme.isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: currentTheme.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        backgroundColor: currentTheme.isDark ? currentTheme.cardBackground : 'white',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: `0 8px 24px ${currentTheme.primary}26`,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: 2,
              background: `${currentTheme.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <GroupIcon 
              sx={{ 
                fontSize: { xs: 32, sm: 40 },
                color: currentTheme.primary,
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
              color: currentTheme.isDark ? currentTheme.textColor : '#333',
            }}
          >
            {group.groupName}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: currentTheme.isDark ? currentTheme.textSecondary : '#666',
            fontWeight: '500',
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
          }}
        >
          👥 {group.memberUids?.length || 0} member{group.memberUids?.length !== 1 ? 's' : ''}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1.5, px: 2 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(group);
          }}
          aria-label="edit"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            color: currentTheme.primary,
            '&:hover': {
              bgcolor: `${currentTheme.primary}15`,
            }
          }}
        >
          <EditIcon fontSize="small" />
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
      </CardActions>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Group"
        message={`Are you sure you want to delete the group "${group.groupName}"? This will not delete any lists, but you won't be able to use this group for new lists.`}
        confirmText="Delete"
      />
    </Card>
  );
};

export default GroupCard;
