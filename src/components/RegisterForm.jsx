import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  Link,
  IconButton,
  InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const RegisterForm = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUser } = useAuth();
  const { currentTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    if (!displayName.trim()) {
      return setError('Please enter your display name.');
    }

    setLoading(true);

    try {
      await registerUser(email, password, displayName);
      // Navigation will be handled by the protected route
    } catch (err) {
      console.error('Registration error:', err);
      setError(getErrorMessage(err.code) || err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      default:
        return 'Failed to create account. Please try again.';
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ color: currentTheme.isDark ? '#ffffff' : 'text.primary' }}>
        Register
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            ...(currentTheme.isDark && {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(211, 47, 47, 0.3)',
              '& .MuiAlert-icon': {
                color: '#ff6b6b',
              },
            }),
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        label="Display Name"
        type="text"
        fullWidth
        required
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        margin="normal"
        autoComplete="name"
        sx={{
          '& .MuiInputLabel-root': {
            color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)',
            },
          },
          '& .MuiInputBase-input': {
            color: currentTheme.isDark ? '#ffffff' : 'text.primary',
          },
        }}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        autoComplete="email"
        sx={{
          '& .MuiInputLabel-root': {
            color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)',
            },
          },
          '& .MuiInputBase-input': {
            color: currentTheme.isDark ? '#ffffff' : 'text.primary',
          },
        }}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        autoComplete="new-password"
        helperText="Minimum 6 characters"
        sx={{
          '& .MuiInputLabel-root': {
            color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)',
            },
          },
          '& .MuiInputBase-input': {
            color: currentTheme.isDark ? '#ffffff' : 'text.primary',
          },
          '& .MuiFormHelperText-root': {
            color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        fullWidth
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        autoComplete="new-password"
        sx={{
          '& .MuiInputLabel-root': {
            color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)',
            },
          },
          '& .MuiInputBase-input': {
            color: currentTheme.isDark ? '#ffffff' : 'text.primary',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ 
          mt: 3, 
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a4292 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.12)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? 'Creating Account...' : 'Register'}
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2, color: currentTheme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
        Already have an account?{' '}
        <Link
          component="button"
          variant="body2"
          onClick={(e) => {
            e.preventDefault();
            onToggleForm();
          }}
          sx={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': {
              color: '#764ba2',
              textDecoration: 'underline',
            },
          }}
        >
          Login here
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
