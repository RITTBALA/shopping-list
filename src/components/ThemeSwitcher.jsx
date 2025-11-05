import {
  Box,
  Paper,
  Typography,
  Backdrop,
  Fade,
  Zoom,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = ({ open, onClose }) => {
  const { changeColorTheme, availableThemes, colorTheme } = useTheme();

  const handleColorThemeChange = (themeKey) => {
    changeColorTheme(themeKey);
    onClose();
  };

  return (
    <>
      {/* Backdrop for color picker */}
      <Fade in={open} timeout={300}>
        <Backdrop
          open={open}
          onClick={onClose}
          sx={{ 
            zIndex: 1299,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
      </Fade>

      {/* Color Picker Panel */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1300,
        }}
      >
        <Zoom in={open} timeout={400} style={{ transitionDelay: open ? '100ms' : '0ms' }}>
          <Paper
            onClick={(e) => e.stopPropagation()}
            sx={{
              p: 3,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
              minWidth: 280,
            }}
          >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              color: '#333',
            }}
          >
            🎨 Choose Color Theme
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(availableThemes).map(([key, theme]) => (
              <Box
                key={key}
                onClick={() => handleColorThemeChange(key)}
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  background: theme.gradient,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: colorTheme === key ? '3px solid white' : 'none',
                  boxShadow: colorTheme === key ? '0 0 0 2px #333' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {theme.name}
                </Typography>
                {colorTheme === key && (
                  <Typography sx={{ fontSize: '1.2rem' }}>✓</Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
        </Zoom>
      </Box>
    </>
  );
};

export default ThemeSwitcher;
