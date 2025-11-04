import { useState, useEffect } from 'react';
import {
  List,
  Paper,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import Item from './Item';
import { subscribeToListItems } from '../firebase/firestoreService';
import { useTheme } from '../context/ThemeContext';

const ItemList = ({ listId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!listId) return;

    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToListItems(listId, (fetchedItems) => {
      setItems(fetchedItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Separate purchased and unpurchased items
  const unpurchasedItems = items.filter(item => !item.isPurchased);
  const purchasedItems = items.filter(item => item.isPurchased);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        overflow: 'hidden',
        background: currentTheme.isDark ? currentTheme.cardBackground : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: currentTheme.isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' : '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        border: currentTheme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      {items.length === 0 ? (
        <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              background: currentTheme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            📝 Your list is empty
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: currentTheme.isDark ? currentTheme.textSecondary : 'text.secondary',
            }}
          >
            Add your first item above to get started!
          </Typography>
        </Box>
      ) : (
        <>
          {/* Unpurchased Items */}
          {unpurchasedItems.length > 0 && (
            <List>
              {unpurchasedItems.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </List>
          )}

          {/* Divider between purchased and unpurchased */}
          {unpurchasedItems.length > 0 && purchasedItems.length > 0 && (
            <Divider sx={{ my: 1, borderColor: currentTheme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  fontWeight: 600,
                  color: currentTheme.primary,
                  px: 2,
                }}
              >
                ✅ Purchased ({purchasedItems.length})
              </Typography>
            </Divider>
          )}

          {/* Purchased Items */}
          {purchasedItems.length > 0 && (
            <List>
              {purchasedItems.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </List>
          )}
        </>
      )}
    </Paper>
  );
};

export default ItemList;
