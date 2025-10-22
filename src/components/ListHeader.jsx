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
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as Icons from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ListHeader = ({ list, onShare, onRename, onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed from 'sm' to 'md'

  if (!list) return null;

  // Get the icon component
  const IconComponent = Icons[list.icon] || Icons.ShoppingCart;

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
          background: `linear-gradient(135deg, ${list.color}22, ${list.color}44)`,
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
          {list.listName}
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

        {isMobile ? (
          <IconButton
            sx={{ 
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={onShare}
            title="Share list"
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            sx={{ 
              mr: 1,
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: '#ffffff',
              },
              transition: 'all 0.3s ease',
            }}
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={onShare}
          >
            Share
          </Button>
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
