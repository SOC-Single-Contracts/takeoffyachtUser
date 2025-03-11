"use client";
import { getWallet } from '@/api/wallet';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletDetails, setwalletDetails] = useState({
    payment_method: 'card',
    payment_intent_id: '',
    topupAmount:0
  });
  const [walletResponse,setWalletResponse] = useState(null)
    const { data: session, status } = useSession();
  const userId = session?.user?.userid || 1;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [token, setToken] = useState(null); 


  


  const updateWalletDetails = (newDetails) => {
    setwalletDetails(prev => {
      const updated = { ...prev, ...newDetails };
      return updated;
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    const getWalletResponse = async () => {
      if (!userId && !token) return;
      try {
        const data = await getWallet(token);
        console.log("data=>",data)
        setWalletResponse(data)
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      getWalletResponse();
    }
  }, [userId,token]);


  

  return (
    <WalletContext.Provider 
      value={{ 
        walletDetails,
        updateWalletDetails,
        walletResponse
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
