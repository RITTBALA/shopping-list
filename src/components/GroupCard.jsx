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
import { useTheme } from '../context/ThemeContext';

const GroupCard = ({ group, onEdit, onDelete }) => {
  const { currentTheme } = useTheme();
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group "${group.groupName}"? This will not delete any lists, but you won't be able to use this group for new lists.`)) {
      onDelete(group.id);
    }
  };

  return (
    <Card
      sx={{
        minHeight: { xs: 140, sm: 160 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: 'white',
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
              color: '#333',
            }}
          >
            {group.groupName}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
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
          onClick={() => onEdit(group)}
          aria-label="edit"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            '&:hover': {
              bgcolor: `${currentTheme.primary}15`,
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ color: currentTheme.primary }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          aria-label="delete"
          sx={{ 
            minWidth: { xs: 40, sm: 48 }, 
            minHeight: { xs: 40, sm: 48 },
            '&:hover': {
              bgcolor: 'rgba(245, 87, 108, 0.1)',
              color: '#f5576c',
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default GroupCard;
