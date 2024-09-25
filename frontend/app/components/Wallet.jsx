"use client";

import React, { useState, useContext, useEffect } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { toast } from 'react-toastify';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'; // Import TonConnectButton and useTonAddress
import Navbar from './Navbar'; // Import Navbar component
import axios from 'axios'; // For API calls
import { Wallet } from 'lucide-react'; // Import Lucide wallet icon
import { AiOutlineDisconnect } from 'lucide-react'; // Import Lucide disconnect icon

const WalletPage = () => {
  const { user, setUser } = useContext(globalContext); // Get user data from context
  const [walletAddress, setWalletAddress] = useState(user.wallet_address || '');

  // Get the current wallet address using TonConnect hooks
  const userFriendlyAddress = useTonAddress(); // Returns the connected wallet address

  useEffect(() => {
    // Only update and send the wallet address if it's different from the current one
    if (userFriendlyAddress && userFriendlyAddress !== walletAddress) {
      setWalletAddress(userFriendlyAddress);
      handleWalletAddressUpdate(userFriendlyAddress);
    }
  }, [userFriendlyAddress, walletAddress]);

  const handleWalletAddressUpdate = async (address) => {
    try {
      // Update user object in context
      setUser(prevUser => ({ ...prevUser, wallet_address: address }));
      setWalletAddress(address);

      // Send wallet address to backend
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-wallet`, {
        id: user._id,
        username: user.username, // Include username or other necessary data
        wallet_address: address
      }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN // Ensure token format is correct
        }
      });

      toast.success('Wallet address updated successfully!');
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast.error('Error updating wallet address');
    }
  };

  if (!user || !user.username) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col relative pb-20">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-black p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700 max-w-md w-full flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">
            Wallet
          </h1>
          <div className="flex flex-col items-center mb-6">
            <Wallet className="text-yellow-400 text-3xl mb-2" />
            <div className="text-center flex flex-col w-full">
              <p className="text-lg font-semibold text-gray-300">Your Wallet Address:</p>
              <p className="text-base text-gray-400 mt-2 break-words w-full">{walletAddress || 'Not connected'}</p>
            </div>
          </div>
          
          {/* Information Card about Airdrop */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">🚀 Airdrop Information</h2>
            <p className="text-gray-300">
              Connect your wallet to participate in upcoming airdrops and exclusive rewards!
            </p>
            <p className="text-gray-400 mt-2">
              More wallet options will be available soon. Make sure to connect your wallet!
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <TonConnectButton>
              <AiOutlineDisconnect className="text-white text-lg mr-2" />
              Connect Wallet
            </TonConnectButton>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p className="text-sm">More options coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletPage;
