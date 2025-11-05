import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUserPreferences } from '../firebase/firestoreService';

/**
 * Custom hook to manage user preferences stored in Firestore
 */
export const useUserPreferences = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState({
    navigationApp: 'google', // default value
  });
  const [loading, setLoading] = useState(true);

  // Load user preferences from Firestore
  useEffect(() => {
    const loadPreferences = async () => {
      if (currentUser?.uid) {
        try {
          const userData = await getUserById(currentUser.uid);
          if (userData?.preferences) {
            setPreferences({
              navigationApp: userData.preferences.navigationApp || 'google',
            });
          }
        } catch (error) {
          console.error('Error loading user preferences:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadPreferences();
  }, [currentUser]);

  // Update a specific preference
  const updatePreference = async (key, value) => {
    if (!currentUser?.uid) {
      console.warn('Cannot update preferences: user not logged in');
      return;
    }

    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);
      await updateUserPreferences(currentUser.uid, updatedPreferences);
    } catch (error) {
      console.error('Error updating preference:', error);
      // Revert on error
      setPreferences(preferences);
      throw error;
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
  };
};
