import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  showBatchRetry: boolean;
  setShowBatchRetry: (show: boolean) => void;
  onBatchRetry?: () => void;
  setOnBatchRetry: (handler: (() => void) | undefined) => void;
  isBatchRetrying: boolean;
  setIsBatchRetrying: (retrying: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showBatchRetry, setShowBatchRetry] = useState(false);
  const [onBatchRetry, setOnBatchRetry] = useState<(() => void) | undefined>(undefined);
  const [isBatchRetrying, setIsBatchRetrying] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        showBatchRetry,
        setShowBatchRetry,
        onBatchRetry,
        setOnBatchRetry: (handler) => setOnBatchRetry(() => handler),
        isBatchRetrying,
        setIsBatchRetrying,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
