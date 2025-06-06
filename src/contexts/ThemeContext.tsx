import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme } from '../types';
import { defaultTheme, darkTheme, lightTheme } from '../themes/defaultTheme';

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: { [key: string]: Theme };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const availableThemes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState('default');
  const theme = availableThemes[themeName] || defaultTheme;

  const setTheme = (newThemeName: string) => {
    if (availableThemes[newThemeName]) {
      setThemeName(newThemeName);
      localStorage.setItem('selectedTheme', newThemeName);
    }
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && availableThemes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};