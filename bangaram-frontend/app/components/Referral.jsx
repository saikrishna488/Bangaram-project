"use client";

import React, { useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { toast } from 'react-toastify';
import { FaShareAlt, FaCopy } from 'react-icons/fa'; // Icons for sharing and copying
import Navbar from './Navbar';

const FriendsPage = () => {
  const { user } = useContext(globalContext); // Get user data from context

  const copyReferralLink = () => {
    const referralLink = `https://t.me/bgrmbot/bangaram?start={user.referral_num}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied to clipboard!'))
      .catch(err => toast.error('Failed to copy referral link'));
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/referral/${user.referral_num}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Bangaram!',
        url: referralLink
      })
      .then(() => toast.success('Referral link shared successfully!'))
      .catch(err => toast.error('Failed to share referral link'));
    } else {
      toast.info('Sharing not supported on this device');
    }
  };

  // Dummy data for invited friends

  return (
    <div className="dark:bg-gray-900 bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">My Friends</h1>
      <div className="max-w-4xl mx-auto bg-gray-700 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Referral Number Section */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Referral Number</h2>
          <p className="text-lg text-gray-300 mb-4">Your unique referral number is:</p>
          <div className="flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-blue-400">{user.referral_num}</span>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={copyReferralLink}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <FaCopy />
              <span>Copy Link</span>
            </button>
            <button
              onClick={shareReferralLink}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
            >
              <FaShareAlt />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Invited Friends Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Invited Friends</h2>
          <ul className="space-y-4">
            {user.invited_friends.map((friend, index) => (
              <li key={index} className="bg-gray-600 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-200">{friend}</span>
                <span className="text-lg font-semibold text-yellow-400"> +10</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default FriendsPage;
