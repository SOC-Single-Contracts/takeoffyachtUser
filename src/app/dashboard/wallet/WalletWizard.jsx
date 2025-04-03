"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Icon, Snowflake, Eye, Plus, EyeOffIcon, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart } from 'lucide-react';
import { useWalletContext, WalletProvider } from "./WalletContext";
import { freezeWallet, getWallet } from "@/api/wallet";
import { useToast } from "@/hooks/use-toast";

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col space-y-4 p-4 border rounded-lg shadow">
    <div className="h-40 bg-gray-300 rounded-lg"></div>
    <div className="h-6 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    <div className="h-10 bg-gray-300 rounded"></div>
  </div>
);

const WalletWizardContent = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { walletDetails, setwalletDetails } = useWalletContext();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || null : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") || null : null;  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const detailsMap = [
    {
      type: "add-money",
      text: `Add Money`,
      condition: null
    },
    {
      type: "freeze",
      text: `Freeze`,
      condition: null
    },
    {
      type: "reveal",
      text: `Reveal`,
      condition: null
    },
  ];



  const handleWallet = (type) => {
    if (type == "add-money") {
      router.push('./wallet/add-money')


    } else if (type == "reveal") {
      setwalletDetails((prev) => {
        const updatedDetails = {
          ...prev,
          hideAmount: !walletDetails?.hideAmount
        };

        return updatedDetails;
      });
    }
    else if (type == "freeze") {
      handleFreeze()
    }
  }

  const handleFreeze = async () => {
    if (!userId && !token) return;
    if (walletDetails?.transactions.length<=0) {
      toast({
        title: "Error",
        description: "kindly Add some Amount to freeze your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await freezeWallet(token,!walletDetails?.freezeWallet);
      // console.log("data=>",data)
      setwalletDetails((prev) => {
        const updatedDetails = {
          ...prev,
          freezeWallet: !walletDetails?.freezeWallet
        };
        return updatedDetails;
      });
      toast({
        title: "Success! 🎉",
        description: data,
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      setError(err.message || 'Unexpected Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getWalletResponse = async () => {
      if (!userId || !token) return;
      try {
        const data = await getWallet(token);
  
        setwalletDetails((prev) => {
          const updatedDetails = {
            ...prev,
            balance: data?.balance ?? prev.balance,
            freezeWallet: data?.freeze ?? prev.freezeWallet,
            transactions: data?.transactions ?? prev.transactions,
          };
  
          // Persist to local storage
          // localStorage.setItem("walletContext", JSON.stringify(updatedDetails));
  
          return updatedDetails;
        });
      } catch (err) {
        setError(err?.response?.data?.detail || "Unexpected Error");
      } finally {
        setLoading(false);
      }
    };
  
    getWalletResponse();
  }, [userId, token]); // Dependency array ensures this runs when userId or token changes
  
  // Listen to `walletDetails` and update localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (walletDetails) {
        localStorage.setItem("walletContext", JSON.stringify(walletDetails));
      }
    }
 
  }, [walletDetails]);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (walletDetails) {
   
        localStorage.setItem("walletContext", JSON.stringify(walletDetails));
      }
    }
   
  }, [walletDetails]);


  // If not logged in, show login prompt
  if (!userId && !token) {
    return (
      <section className="py-16 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Looks like you're not logged in. Please sign in to view and manage your Wallet.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
          >
            Login to Continue
          </Button>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }


  // Show loading state while checking session
  if (loading || error) {
    return (
      <section className="py-10">
        <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
          <div className="animate-pulse w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
        </div>
        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 mx-auto my-12">
          {Array(4).fill(null).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      </section>
    );
  }






  return (
    <section className="py-10 mt-7">
      <div className="max-w-5xl px-2 mx-auto flex  flex-col space-x-4">
        <div className="flex items-center">
          <Button
            onClick={() => router.back()}
            className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </Button>
          <h1 className="text-sm md:text-lg mx-3 font-medium">My Wallet</h1>

        </div>

        <div className="bg-white mx-2 mt-4 dark:bg-gray-800 rounded-2xl p-4 shadow-lg overflow-hidden">
          <div className="flex  justify-between">

            <h2 className="text-sm md:text-lg font-bold">Available Balance</h2>
            <h2 className="text-sm md:text-lg font-bold">
              {!walletDetails?.hideAmount ? `$${walletDetails?.balance}` : "*****"}
            </h2>


          </div>

          <div className="grid grid-cols-3  gap-4 my-3">
            {/* {walletOptions()} */}
          {  detailsMap?.map(({ type, text }, index) => (
    <div
      key={index}
      className="flex flex-col justify-center items-center w-full h-20 "
    >
      {/* <Image src={type} quality={100} alt={text} width={20} height={20} className="dark:invert" /> */}
      <Button
        variant="default"
        size="icon"
        className="rounded-full h-12 w-12 ml-2 bg-[#BEA355]"
        onClick={() => handleWallet(type)}
      >

        {type == 'add-money' ? <Plus className="h-8 w-8 dark:invert" />
          : type == "freeze" ? <Snowflake className="h-8 w-8 dark:invert" />
            : type == "reveal" ? walletDetails?.hideAmount ?  <Eye className="h-8 w-8 dark:invert" />: <EyeOff className="h-8 w-8 dark:invert" />

              : ""}




      </Button>

      <p className="text-gray-700 text-center text-sm dark:text-gray-300 mt-2">{text}</p>
    </div>
  ))}

{/* <h2 className="text-sm md:text-lg font-bold"> {walletDetails?.freezeWallet ? "(wallet Freeze)" :""} </h2> */}

          </div>


        </div>
      </div>




    </section>
  );
};


const WalletWizard = () => {
  return (
    <WalletProvider>
      <WalletWizardContent />
    </WalletProvider>
  );
};

export default WalletWizard;