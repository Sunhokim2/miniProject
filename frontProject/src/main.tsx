import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import { getTheme } from '@/theme';
import App from './App';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Theme Provider Wrapper
const ThemeWrapper = (props) => {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
); 