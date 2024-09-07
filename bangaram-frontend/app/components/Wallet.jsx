"use client";

import React, { useState, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import Navbar from './Navbar'; // Import Navbar component
import { toast } from 'react-toastify';

const WalletPage = () => {
  const { user, setUser } = useContext(globalContext); // Get user data from context
  const [walletAddress, setWalletAddress] = useState(user.wallet_address || '');
  const [inputAddress, setInputAddress] = useState('');

  const handleSaveAddress = async () => {
    try {
      // Update user object in context
      setUser((prevUser) => ({ ...prevUser, wallet_address: inputAddress }));
      
      // Send wallet address to backend
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-wallet`, {
        id : user._id,
        username: user.username, // Include username or other necessary data
        wallet_address: inputAddress
      });

      const data = res.data.user
      setUser(data)

      setWalletAddress(inputAddress);
      toast('Wallet address updated successfully!');
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast('Error updating wallet address');
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Wallet</h1>
      <div className="max-w-lg mx-auto bg-gray-700 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-200">Your Wallet Address:</p>
          <p className="text-md text-gray-300">{walletAddress || 'Not connected'}</p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-200 mb-2">Enter Your TON Wallet Address:</p>
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Enter your TON wallet address"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600"
          />
        </div>
        <button
          onClick={handleSaveAddress}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
        >
          Save Wallet Address
        </button>
        <div className="mt-6 text-gray-300">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <p>1. Open your Telegram app.</p>
          <p>2. Go to your wallet or the chat where you receive or send tokens.</p>
          <p>3. Tap on your wallet address to copy it.</p>
          <p>4. Paste the copied address into the input field above and click "Save Wallet Address".</p>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default WalletPage;
