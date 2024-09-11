"use client"
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
      className="fixed top-4 right-4 bg-black text-white border border-gray-700 rounded-full p-3 flex items-center shadow-lg"
    >
      {walletAddress ? (
        <>
          <span className="truncate w-[200px]">{walletAddress.slice(0, 10)}...</span>
          <FaWallet size={20} />
        </>
      ) : (
        <FaWallet size={24} />
      )}
    </button>
  );
};

export default WalletButton;
