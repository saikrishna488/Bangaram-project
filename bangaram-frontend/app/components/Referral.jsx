"use client";

import React, { useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { toast } from 'react-toastify';
import { FaShareAlt, FaCopy, FaUserFriends } from 'react-icons/fa'; // Icons for sharing, copying, and friends
import Navbar from './Navbar';

const FriendsPage = () => {
  const { user } = useContext(globalContext); // Get user data from context

  const copyReferralLink = () => {
    const referralLink = `https://t.me/bgrmbot/bangaram?start=${user.referral_num}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied to clipboard!'))
      .catch(err => toast.error('Failed to copy referral link'));
  };

  const shareReferralLink = () => {
    const referralLink = `https://t.me/bgrmbot/bangaram?start=${user.referral_num}`;
  
    if (navigator.share) {
      // Native sharing
      navigator.share({
        title: 'Join me on Bangaram!',
        url: referralLink
      })
      .then(() => toast.success('Referral link shared successfully!'))
      .catch(err => toast.error('Failed to share referral link'));
    } else {
      // Fallback for unsupported browsers
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20me%20on%20Bangaram!`;
      
      window.open(telegramShareUrl, '_blank');
      toast.info('Sharing via Telegram');
    }
  };
  
  if (!user || !user.username) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-black to-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 pb-20">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8 text-white">My Friends</h1>
      <div className="max-w-3xl mx-auto bg-gray-800 dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg">
        {/* Referral Number Section */}
        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Referral Number</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-4">Your unique referral number is:</p>
          <div className="flex items-center justify-center mb-4">
            <span className="text-lg sm:text-xl font-bold text-blue-400">{user.referral_num}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={copyReferralLink}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <FaCopy />
              <span className="text-sm sm:text-base">Copy Link</span>
            </button>
            <button
              onClick={shareReferralLink}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
            >
              <FaShareAlt />
              <span className="text-sm sm:text-base">Share Link</span>
            </button>
          </div>
        </div>

        {/* Invited Friends Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Invited Friends</h2>
          {user.invited_friends && user.invited_friends.length > 0 ? (
            <ul className="space-y-4">
              {user.invited_friends.map((friend, index) => (
                <li
                  key={index}
                  className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between border border-blue-600 dark:border-purple-600 hover:border-pink-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <FaUserFriends className="text-yellow-400" /> {/* Friends icon */}
                    <span className="text-base sm:text-lg font-semibold text-gray-200">{friend}</span>
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-yellow-400"> +10</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No friends invited yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
