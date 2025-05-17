import { createTheme, ThemeOptions } from '@mui/material/styles';

// 라이트 모드 테마
const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#6366f1',
      dark: '#4338ca',
    },
    secondary: {
      main: '#f43f5e',
      light: '#fb7185',
      dark: '#e11d48',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
};

// 다크 모드 테마
const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#fb7185',
      light: '#fda4af',
      dark: '#f43f5e',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return createTheme(mode === 'light' ? lightTheme : darkTheme);
}; 