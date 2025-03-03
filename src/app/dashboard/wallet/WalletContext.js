"use client";
import { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletDetails, setwalletDetails] = useState({
    payment_method: 'card',
    payment_intent_id: '',
    topupAmount:0
  });

  const updateWalletDetails = (newDetails) => {
    setwalletDetails(prev => {
      const updated = { ...prev, ...newDetails };
      return updated;
    });
  };

  

  return (
    <WalletContext.Provider 
      value={{ 
        walletDetails,
        updateWalletDetails
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;
