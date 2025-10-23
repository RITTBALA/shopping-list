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
          background: 'white',
          '& fieldset': {
            borderColor: 'rgba(102, 126, 234, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(102, 126, 234, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: currentTheme.primary,
            borderWidth: '2px',
          },
        },
      }}
    >
      <InputLabel>Share with</InputLabel>
      <Select
        value={value || 'just-me'}
        onChange={(e) => onChange(e.target.value)}
        label="Share with"
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
