import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getGroupsForUser } from '../firebase/firestoreService';

const GroupPicker = ({ value, onChange }) => {
  const [groups, setGroups] = useState([]);
  const { currentUser } = useAuth();
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = getGroupsForUser(currentUser.uid, (fetchedGroups) => {
      setGroups(fetchedGroups);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <FormControl 
      fullWidth 
      sx={{ 
        mt: 2,
        mb: 2,
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
        '& .MuiSelect-select': {
          color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
        },
        '& .MuiSvgIcon-root': {
          color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
        },
      }}
    >
      <InputLabel>Share with</InputLabel>
      <Select
        value={value || 'just-me'}
        onChange={(e) => onChange(e.target.value)}
        label="Share with"
        renderValue={(selected) => {
          if (selected === 'just-me') {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" sx={{ color: `${currentTheme.primary} !important` }} />
                <Typography>Just Me</Typography>
              </Box>
            );
          }
          const selectedGroup = groups.find(g => g.id === selected);
          if (!selectedGroup) return selected;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon fontSize="small" sx={{ color: `${currentTheme.primary} !important` }} />
              <Typography>{selectedGroup.groupName}</Typography>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: currentTheme.isDark ? currentTheme.cardBackground : 'white',
              borderRadius: '12px',
              mt: 1,
              boxShadow: currentTheme.isDark 
                ? '0 8px 32px rgba(0,0,0,0.6)' 
                : '0 8px 32px rgba(31, 38, 135, 0.15)',
              border: currentTheme.isDark 
                ? '1px solid rgba(255,255,255,0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              '& .MuiMenuItem-root': {
                color: currentTheme.isDark ? currentTheme.textColor : 'inherit',
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                '&:hover': {
                  bgcolor: currentTheme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.08)',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
                '&.Mui-selected': {
                  bgcolor: currentTheme.isDark ? 'rgba(102, 126, 234, 0.25)' : 'rgba(102, 126, 234, 0.12)',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: currentTheme.isDark ? 'rgba(102, 126, 234, 0.35)' : 'rgba(102, 126, 234, 0.18)',
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="just-me">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon fontSize="small" sx={{ color: currentTheme.primary }} />
            <Typography>Just Me</Typography>
          </Box>
        </MenuItem>
        {groups.map((group) => (
          <MenuItem key={group.id} value={group.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon fontSize="small" sx={{ color: currentTheme.primary }} />
              <Typography>{group.groupName}</Typography>
              <Typography variant="caption" color="text.secondary">
                ({group.memberUids?.length || 0} members)
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GroupPicker;
