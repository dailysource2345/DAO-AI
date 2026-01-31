import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PageLoading } from '@/components/page-loading';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showPageLoading: (message?: string) => void;
  hidePageLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [showFullPageLoading, setShowFullPageLoading] = useState(false);
  const [location] = useLocation();

  // Show loading briefly when navigating
  useEffect(() => {
    setShowFullPageLoading(true);
    setLoadingMessage('Loading page...');
    
    const timer = setTimeout(() => {
      setShowFullPageLoading(false);
    }, 300); // Show for 300ms to prevent flash on fast loads

    return () => clearTimeout(timer);
  }, [location]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showPageLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setShowFullPageLoading(true);
  };

  const hidePageLoading = () => {
    setShowFullPageLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setLoading, 
      showPageLoading, 
      hidePageLoading 
    }}>
      {children}
      {showFullPageLoading && <PageLoading message={loadingMessage} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}