import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { updateList } from '../firebase/firestoreService';
import { useTheme } from '../context/ThemeContext';

const COLOR_OPTIONS = [
  { value: '#FFE5E5', label: 'Soft Coral' },
  { value: '#E8F4FD', label: 'Sky Blue' },
  { value: '#E8F8F5', label: 'Mint Green' },
  { value: '#FFF4E6', label: 'Peach' },
  { value: '#F3E5F5', label: 'Lavender' },
  { value: '#FCE4EC', label: 'Rose' },
  { value: '#E0F2F1', label: 'Teal' },
  { value: '#FFF9C4', label: 'Lemon' },
  { value: '#F1F8E9', label: 'Lime' },
  { value: '#EDE7F6', label: 'Violet' },
  { value: '#E1F5FE', label: 'Ice Blue' },
  { value: '#FBE9E7', label: 'Apricot' },
];

const RenameListDialog = ({ open, onClose, list }) => {
  const [listName, setListName] = useState(list?.listName || '');
  const [color, setColor] = useState(list?.color || '#E8F4FD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (list) {
      setListName(list.listName || '');
      setColor(list.color || '#E8F4FD');
    }
  }, [list]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }

    setLoading(true);

    try {
      await updateList(list.id, { 
        listName: listName.trim(),
        color: color,
      });
      onClose(true); // Pass true to indicate success
    } catch (err) {
      setError('Failed to update list. Please try again.');
      console.error('Error updating list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setListName(list?.listName || '');
      setColor(list?.color || '#E8F4FD');
      setError('');
      onClose(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.98)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          fontWeight: 700,
          fontSize: '1.5rem',
          background: currentTheme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          pb: 1,
        }}>
          Edit List
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
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
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: currentTheme.isDark ? currentTheme.cardBackground : 'white',
                '& fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.primary,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: currentTheme.isDark ? currentTheme.textSecondary : 'rgba(0,0,0,0.6)',
              },
              '& .MuiInputBase-input': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
              },
            }}
          />

          <Typography 
            variant="subtitle2" 
            sx={{ 
              mt: 3,
              mb: 1.5,
              fontWeight: '600',
              color: currentTheme.isDark ? currentTheme.textColor : '#333',
            }}
          >
            Color Theme
          </Typography>
          <Grid container spacing={1.5}>
            {COLOR_OPTIONS.map((option) => (
              <Grid item key={option.value}>
                <Paper
                  elevation={color === option.value ? 8 : 2}
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: option.value,
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: color === option.value ? `3px solid ${currentTheme.primary}` : '2px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.15)',
                      boxShadow: `0 4px 12px ${currentTheme.primary}33`,
                    },
                  }}
                  onClick={() => setColor(option.value)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: '600',
              px: 3,
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: '600',
              px: 3,
              background: currentTheme.gradient,
              color: 'white',
              boxShadow: `0 4px 12px ${currentTheme.primary}33`,
              '&:hover': {
                opacity: 0.9,
                boxShadow: `0 6px 16px ${currentTheme.primary}4D`,
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenameListDialog;
