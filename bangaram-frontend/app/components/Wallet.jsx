"use client";

import React, { useState, useContext, useEffect } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { toast } from 'react-toastify';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'; // Import TonConnectButton and useTonAddress
import Navbar from './Navbar'; // Import Navbar component
import axios from 'axios'; // For API calls

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

  if (!user && !user.username) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-900 bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Wallet</h1>
      <div className="max-w-lg mx-auto bg-gray-700 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-200">Your Wallet Address:</p>
          <p className="text-md text-gray-300">{walletAddress || 'Not connected'}</p>
        </div>
        <div className="mb-6 flex justify-center"> {/* Align the button to center */}
          <TonConnectButton
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          />
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default WalletPage;
