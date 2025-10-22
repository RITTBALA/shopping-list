import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { createList, getGroup } from '../firebase/firestoreService';
import GroupPicker from './GroupPicker';

const ICON_OPTIONS = [
  { value: 'ShoppingCart', label: 'Shopping Cart', icon: Icons.ShoppingCart },
  { value: 'LocalGroceryStore', label: 'Grocery Store', icon: Icons.LocalGroceryStore },
  { value: 'Restaurant', label: 'Restaurant', icon: Icons.Restaurant },
  { value: 'Fastfood', label: 'Fast Food', icon: Icons.Fastfood },
  { value: 'Home', label: 'Home', icon: Icons.Home },
  { value: 'Work', label: 'Work', icon: Icons.Work },
  { value: 'Favorite', label: 'Favorite', icon: Icons.Favorite },
  { value: 'Star', label: 'Star', icon: Icons.Star },
];

const COLOR_OPTIONS = [
  { value: '#ffebee', label: 'Light Red' },
  { value: '#e3f2fd', label: 'Light Blue' },
  { value: '#e8f5e9', label: 'Light Green' },
  { value: '#fff3e0', label: 'Light Orange' },
  { value: '#f3e5f5', label: 'Light Purple' },
  { value: '#fce4ec', label: 'Light Pink' },
  { value: '#e0f7fa', label: 'Light Cyan' },
  { value: '#fff9c4', label: 'Light Yellow' },
];

const CreateListDialog = ({ open, onClose }) => {
  const [listName, setListName] = useState('');
  const [icon, setIcon] = useState('ShoppingCart');
  const [color, setColor] = useState('#e3f2fd');
  const [selectedGroup, setSelectedGroup] = useState('just-me');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }

    setLoading(true);

    try {
      let members = [currentUser.uid]; // Default to just the current user

      // If a group is selected, get its members
      if (selectedGroup !== 'just-me') {
        const group = await getGroup(selectedGroup);
        if (group && group.memberUids) {
          members = group.memberUids;
        }
      }

      await createList(
        {
          listName: listName.trim(),
          icon,
          color,
          members, // Pass the members array
        },
        currentUser.uid
      );
      
      // Reset form and close dialog
      setListName('');
      setIcon('ShoppingCart');
      setColor('#e3f2fd');
      setSelectedGroup('just-me');
      onClose();
    } catch (err) {
      setError('Failed to create list. Please try again.');
      console.error('Error creating list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setListName('');
      setIcon('ShoppingCart');
      setColor('#e3f2fd');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Shopping List</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="normal"
            label="List Name"
            type="text"
            fullWidth
            required
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g., Weekly Groceries"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Icon</InputLabel>
            <Select
              value={icon}
              label="Icon"
              onChange={(e) => setIcon(e.target.value)}
            >
              {ICON_OPTIONS.map((option) => {
                const IconComp = option.icon;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconComp sx={{ mr: 1 }} />
                      {option.label}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <GroupPicker 
            value={selectedGroup}
            onChange={setSelectedGroup}
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Color
          </Typography>
          <Grid container spacing={1}>
            {COLOR_OPTIONS.map((option) => (
              <Grid item key={option.value}>
                <Paper
                  elevation={color === option.value ? 6 : 1}
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: option.value,
                    cursor: 'pointer',
                    border: color === option.value ? '3px solid #1976d2' : 'none',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => setColor(option.value)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create List'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateListDialog;
