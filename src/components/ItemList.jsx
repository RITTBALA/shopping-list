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

const ItemList = ({ listId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      {items.length === 0 ? (
        <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            📝 Your list is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
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
            <Divider sx={{ my: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  fontWeight: 600,
                  color: '#667eea',
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
