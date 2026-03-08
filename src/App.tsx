import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationProvider } from './contexts/NavigationContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { DownloadPage } from './pages/DownloadPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Main App component with routing
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/download" element={<DownloadPage />} />
          </Routes>
        </NavigationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
