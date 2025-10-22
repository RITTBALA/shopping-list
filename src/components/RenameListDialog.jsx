import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { updateList } from '../firebase/firestoreService';

const RenameListDialog = ({ open, onClose, list }) => {
  const [listName, setListName] = useState(list?.listName || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }

    setLoading(true);

    try {
      await updateList(list.id, { listName: listName.trim() });
      onClose(true); // Pass true to indicate success
    } catch (err) {
      setError('Failed to rename list. Please try again.');
      console.error('Error renaming list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setListName(list?.listName || '');
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
          background: 'rgba(255, 255, 255, 0.98)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          fontWeight: 700,
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          pb: 1,
        }}>
          ✏️ Rename List
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
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#667eea',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              borderRadius: '10px',
              px: 3,
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
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
              borderRadius: '10px',
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              },
            }}
          >
            {loading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenameListDialog;
