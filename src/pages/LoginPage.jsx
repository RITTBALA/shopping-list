import { useState, useEffect } from 'react';
import { Container, Paper, Box, Typography, IconButton, Tooltip, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import PaletteIcon from '@mui/icons-material/Palette';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ThemeSwitcher from '../components/ThemeSwitcher';

const ADMIN_EMAIL = 'admin@admin.com';

// Keyframe animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25), 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const colorShift = keyframes`
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(30deg);
  }
`;

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { currentUser } = useAuth();
  const { currentTheme } = useCustomTheme();
  const navigate = useNavigate();

  const handleThemeButtonClick = () => {
    setIsAnimating(true);
    setThemeModalOpen(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

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
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: currentTheme.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 0 },
          transition: 'background 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Theme Picker Button */}
        <Tooltip title="Change Theme" placement="left">
          <IconButton
            onClick={handleThemeButtonClick}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: 56,
              height: 56,
              animation: isAnimating ? `${pulse} 0.6s ease-out` : 'none',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1) rotate(15deg)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              transition: 'all 0.3s ease',
              zIndex: 1000,
            }}
          >
            <PaletteIcon 
              sx={{ 
                color: currentTheme.primary, 
                fontSize: 28,
                animation: isAnimating ? `${rotate} 0.6s ease-out, ${colorShift} 0.6s ease-out` : 'none',
              }} 
            />
          </IconButton>
        </Tooltip>

        <Container 
          maxWidth="sm" 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
          }}
        >
          <Paper 
            elevation={10} 
            sx={{ 
              p: { xs: 3, sm: 4, md: 5 }, 
              width: '100%',
              borderRadius: 4,
              boxShadow: currentTheme.isDark 
                ? '0 20px 60px rgba(0,0,0,0.8)' 
                : '0 20px 60px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(20px)',
              background: currentTheme.isDark 
                ? '#1a1a2e' 
                : 'rgba(255, 255, 255, 0.95)',
              border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: currentTheme.gradient,
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <Typography variant="h2" sx={{ fontSize: '3rem' }}>
                  🛒
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: currentTheme.isDark ? '#ffffff' : currentTheme.primary,
                  mb: 1,
                  letterSpacing: '-0.5px',
                }}
              >
                EasyShopping List
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: currentTheme.isDark ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                  fontWeight: 400,
                }}
              >
                {showLogin ? '👋 Welcome back!' : '🎉 Create your account'}
              </Typography>
            </Box>

            {/* Forms */}
            {showLogin ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <RegisterForm onToggleForm={toggleForm} />
            )}
          </Paper>

          {/* Footer */}
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: 3,
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            © 2025 EasyShopping List. Made with ❤️
          </Typography>
        </Container>
      </Box>

      {/* Theme Switcher Modal */}
      <ThemeSwitcher 
        open={themeModalOpen} 
        onClose={() => setThemeModalOpen(false)} 
      />
    </>
  );
};

export default LoginPage;
