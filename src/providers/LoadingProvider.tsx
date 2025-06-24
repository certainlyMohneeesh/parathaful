'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {showLoader && (
        <LoadingScreen 
          isLoading={isLoading} 
          onLoadingComplete={handleLoadingComplete}
        />
      )}
      {children}
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