import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toggleItemPurchased, deleteItem } from '../firebase/firestoreService';

const Item = ({ item }) => {
  const handleToggle = async () => {
    try {
      await toggleItemPurchased(item.id, item.isPurchased);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton 
          edge="end" 
          onClick={handleDelete}
          sx={{ 
            minWidth: { xs: 40, sm: 44 },
            minHeight: { xs: 40, sm: 44 },
            mr: { xs: 0.5, sm: 1 },
            color: '#ef4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      }
      disablePadding
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover': {
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <ListItemButton 
        onClick={handleToggle} 
        dense
        sx={{
          py: { xs: 1.5, sm: 2 },
          pr: { xs: 6, sm: 7 },
        }}
      >
        <ListItemIcon sx={{ minWidth: { xs: 42, sm: 48 } }}>
          <Checkbox
            edge="start"
            checked={item.isPurchased}
            tabIndex={-1}
            disableRipple
            sx={{
              color: 'rgba(102, 126, 234, 0.6)',
              '&.Mui-checked': {
                color: '#667eea',
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: 22, sm: 24 },
              }
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={item.itemName}
          primaryTypographyProps={{
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            fontWeight: item.isPurchased ? 400 : 500,
          }}
          sx={{
            textDecoration: item.isPurchased ? 'line-through' : 'none',
            color: item.isPurchased ? 'text.secondary' : 'text.primary',
            opacity: item.isPurchased ? 0.6 : 1,
            transition: 'all 0.2s ease',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default Item;
