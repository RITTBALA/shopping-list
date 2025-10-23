import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addItem } from '../firebase/firestoreService';
import { useAuth } from '../context/AuthContext';

const UNIT_OPTIONS = [
  { value: '', label: 'No unit' },
  { value: 'l', label: 'l' },
  { value: 'kg', label: 'kg' },
  { value: 'pcs', label: 'pcs' },
  { value: 'box', label: 'box' },
  { value: 'can', label: 'can' },
  { value: 'g', label: 'g' },
  { value: 'ml', label: 'ml' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'bottle', label: 'bottle' },
  { value: 'pack', label: 'pack' },
];

const AddItemForm = ({ listId }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemName.trim()) return;

    setLoading(true);

    try {
      await addItem(
        { 
          itemName: itemName.trim(),
          quantity: quantity.trim(),
          unit: unit
        },
        listId,
        currentUser.uid
      );
      setItemName(''); // Clear the inputs
      setQuantity('');
      setUnit('');
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
      >
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="✨ Item name..."
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
          </Grid>
          <Grid item xs={5} sm={2.5}>
            <TextField
              fullWidth
              placeholder="Qty"
              type="number"
              inputProps={{
                min: 0,
                step: 0.1,
              }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                // Hide default number input arrows (spinner)
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }}
            />
          </Grid>
          <Grid item xs={5} sm={2.5}>
            <FormControl fullWidth size="medium">
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={loading}
                displayEmpty
                sx={{
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
                  '& .MuiSelect-select': {
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }
                }}
              >
                {UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton
              type="submit"
              disabled={loading || !itemName.trim()}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '100%',
                height: '100%',
                minHeight: { xs: 48, sm: 56 },
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
                transition: 'all 0.2s ease',
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddItemForm;
