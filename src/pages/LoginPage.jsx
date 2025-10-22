import { useState, useEffect } from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const ADMIN_EMAIL = 'admin@admin.com';

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { currentUser } = useAuth();
  const { currentTheme } = useCustomTheme();
  const navigate = useNavigate();

  // Redirect to dashboard or admin panel if user is already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.email === ADMIN_EMAIL) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: currentTheme.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 0 },
        transition: 'background 0.3s ease',
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              🛒 Shopping List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {showLogin ? 'Welcome back!' : 'Create your account'}
            </Typography>
          </Box>
          {showLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
