"use client";
import { freezeWallet, getWallet } from '@/api/wallet';
import { Transaction } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletDetails, setwalletDetails] = useState({
    payment_method: 'card',
    payment_intent_id: '',
    topupAmount:0,
    balance:0,
    hideAmount:false,
    freezeWallet:false,
    transactions:[]
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
        updateWalletDetails,
        setwalletDetails
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
