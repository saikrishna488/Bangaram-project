"use client";
import React from 'react';
import { FaWallet } from 'react-icons/fa'; // Import wallet icon
import { useRouter } from 'next/navigation';

const WalletButton = ({ walletAddress }) => {
  const router = useRouter();

  const handleWalletClick = () => {
    // Redirect to the wallet page
    router.push('/wallet');
  };

  return (
    <button
      onClick={handleWalletClick}
      className="fixed top-4 right-4 bg-black text-white border border-gray-700 hover:border-gray-500 rounded-full p-2 flex items-center shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
    >
      {walletAddress ? (
        <div className="flex items-center space-x-2">
          <span className="truncate w-[90px] md:w-[150px] text-xs font-medium">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <FaWallet size={16} />
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium">Connect Wallet</span>
          <FaWallet size={18} />
        </div>
      )}
    </button>
  );
};

export default WalletButton;
