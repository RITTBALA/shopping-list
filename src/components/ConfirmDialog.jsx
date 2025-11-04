import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTheme } from '../context/ThemeContext';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  const { currentTheme } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.98)',
          border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        fontWeight: 700,
        fontSize: '1.5rem',
        color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
        pb: 2,
      }}>
        <WarningAmberIcon sx={{ fontSize: 32, color: '#ef4444' }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography 
          sx={{ 
            color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1,
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
            color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
            '&:hover': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
              backgroundColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            boxShadow: '0 4px 15px 0 rgba(239, 68, 68, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.5)',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
