import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider, useStore } from './context/StoreContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/layout/Header';
import Home from './screens/Home';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const AppContent = () => {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { selectedStore, setSelectedStore } = useStore();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (authError) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{authError.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Header 
        selectedStore={selectedStore} 
        userInfo={user} 
        onStoreChange={setSelectedStore} 
      />
      <Home />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
