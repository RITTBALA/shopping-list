import {
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapIcon from '@mui/icons-material/Map';
import * as Icons from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ListHeader = ({ list, onShare, onExport, onRename, onMenuClick }) => {
  // Open Google Maps for navigation
  const handleDirections = () => {
    if (!location) return;
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`,'_blank');
  };
  // Safe defaults for list properties
  const icon = list?.icon || 'ShoppingCart';
  const color = list?.color || '#E8F4FD';
  const listName = list?.listName || '';
  const location = list?.location || '';
        
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const { currentTheme } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md')); // Changed from 'sm' to 'md'

  if (!list) return null;

  // Get the icon component
  const IconComponent = Icons[icon] || Icons.ShoppingCart;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: currentTheme.gradient,
        backdropFilter: 'blur(10px)',
        boxShadow: currentTheme.isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.6)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.18)',
        color: '#ffffff',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ 
            mr: { xs: 1, sm: 2 },
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => navigate('/dashboard')}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ 
          mr: { xs: 1, sm: 2 },
          p: 1,
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconComponent sx={{ fontSize: { xs: 28, sm: 32 }, color: '#ffffff' }} />
        </Box>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: '#ffffff',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.35rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {listName}
        </Typography>

        <IconButton
          sx={{ 
            mr: { xs: 0.5, sm: 1 },
            color: currentTheme.isDark ? '#60a5fa' : currentTheme.primary,
            '&:hover': {
              backgroundColor: currentTheme.isDark ? 'rgba(96, 165, 250, 0.15)' : `${currentTheme.primary}26`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={onRename}
          title="Rename list"
        >
          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>

        <IconButton
          sx={{
            mr: { xs: 0.5, sm: 1 },
            color: '#22c55e',
            '&:hover': {
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
          onClick={handleDirections}
          title={location ? `Navigate to ${location}` : 'No location set'}
          disabled={!location}
        >
          <MapIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>

        {isMobile ? (
          <>
            <IconButton
              sx={{ 
                mr: 0.5,
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={onExport}
              title="Export list"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ 
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={onShare}
              title="Share list"
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              sx={{ 
                mr: 1,
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: '1.5px',
                fontWeight: 600,
                px: 2.5,
                py: 0.75,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  borderWidth: '1.5px',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                },
                transition: 'all 0.3s ease',
              }}
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExport}
            >
              Export
            </Button>
            <Button
              sx={{ 
                mr: 1,
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: '1.5px',
                fontWeight: 600,
                px: 2.5,
                py: 0.75,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  borderWidth: '1.5px',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                },
                transition: 'all 0.3s ease',
              }}
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={onShare}
            >
              Share
            </Button>
          </>
        )}

        <IconButton 
          sx={{ 
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={onMenuClick}
        >
          <MoreVertIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ListHeader;
