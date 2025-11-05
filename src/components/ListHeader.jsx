import {
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapIcon from '@mui/icons-material/Map';
import * as Icons from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ListHeader = ({ list, onShare, onExport, onRename, onMenuClick }) => {
  // Open navigation app based on user preference
  const handleDirections = () => {
    if (!location) return;
    const query = encodeURIComponent(location);
    const navigationApp = localStorage.getItem('navigationApp') || 'google';
    
    if (navigationApp === 'waze') {
      // Open Waze
      window.open(`https://waze.com/ul?q=${query}&navigate=yes`, '_blank');
    } else {
      // Open Google Maps (default)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
    }
  };
  // Safe defaults for list properties
  const icon = list?.icon || 'ShoppingCart';
  const color = list?.color || '#E8F4FD';
  const listName = list?.listName || '';
  const location = list?.location || '';
        
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed from 'sm' to 'md'

  if (!list) return null;

  // Get the icon component
  const IconComponent = Icons[icon] || Icons.ShoppingCart;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
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
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
          background: `linear-gradient(135deg, ${color}22, ${color}44)`,
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
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
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
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
                borderColor: 'rgba(255, 255, 255, 0.7)',
                borderWidth: '1.5px',
                fontWeight: 600,
                px: 2.5,
                py: 0.75,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: '#ffffff',
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
                borderColor: 'rgba(255, 255, 255, 0.7)',
                borderWidth: '1.5px',
                fontWeight: 600,
                px: 2.5,
                py: 0.75,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: '#ffffff',
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
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
