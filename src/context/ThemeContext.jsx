import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Available color themes
export const COLOR_THEMES = {
  purple: {
    name: 'Purple Dream',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#667eea',
    secondary: '#764ba2',
  },
  ocean: {
    name: 'Ocean Blue',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
    primary: '#2196F3',
    secondary: '#00BCD4',
  },
  sunset: {
    name: 'Sunset Orange',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
    primary: '#FF6B6B',
    secondary: '#FFD93D',
  },
  forest: {
    name: 'Forest Green',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    primary: '#11998e',
    secondary: '#38ef7d',
  },
  rose: {
    name: 'Rose Pink',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    primary: '#f093fb',
    secondary: '#f5576c',
  },
  midnight: {
    name: 'Midnight Blue',
    gradient: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
    primary: '#4A00E0',
    secondary: '#8E2DE2',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('colorTheme');
    return saved || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeColorTheme = (theme) => {
    if (COLOR_THEMES[theme]) {
      setColorTheme(theme);
    }
  };

  const currentTheme = COLOR_THEMES[colorTheme];

  const value = {
    isDarkMode,
    toggleDarkMode,
    colorTheme,
    changeColorTheme,
    currentTheme,
    availableThemes: COLOR_THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
