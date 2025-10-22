import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addItem } from '../firebase/firestoreService';
import { useAuth } from '../context/AuthContext';

const AddItemForm = ({ listId }) => {
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemName.trim()) return;

    setLoading(true);

    try {
      await addItem(
        { itemName: itemName.trim() },
        listId,
        currentUser.uid
      );
      setItemName(''); // Clear the input
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 2.5 }, 
        mb: { xs: 2, sm: 3 },
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}
      >
        <TextField
          fullWidth
          placeholder="✨ Add an item..."
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          disabled={loading}
          size="medium"
          autoComplete="off"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: 'white',
              '& fieldset': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
                borderWidth: '2px',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }
          }}
        />
        <IconButton
          type="submit"
          disabled={loading || !itemName.trim()}
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            borderRadius: '12px',
            boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <AddIcon fontSize="medium" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AddItemForm;
