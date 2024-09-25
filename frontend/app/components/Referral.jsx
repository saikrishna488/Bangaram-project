"use client";

import React, { useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { toast } from 'react-toastify';
import { Clipboard, Share, UserPlus } from 'lucide-react'; // Import Lucide icons

const FriendsPage = () => {
  const { user } = useContext(globalContext); // Get user data from context

  const copyReferralLink = () => {
    const referralLink = `https://t.me/bgrmbot/bangaram?startapp=${user.referral_num}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied to clipboard!'))
      .catch(err => toast.error('Failed to copy referral link'));
  };

  const shareReferralLink = () => {
    const referralLink = `https://t.me/bgrmbot/bangaram?startapp=${user.referral_num}`;

    // Short description for sharing
    const description = `🚀 Join Bangaram and earn rewards! Use my link: ${referralLink}`;

    // Generate the Telegram share URL with the referral link and description
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(description.trim())}`;

    // Open Telegram share window
    window.open(telegramShareUrl, '_blank');
    toast.info('Sharing via Telegram');
  };

  if (!user || !user.username) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen p-4 sm:p-6 lg:p-8 relative">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8 text-white">My Friends</h1>
      <div className="max-w-3xl mx-auto bg-black p-4 sm:p-6 rounded-lg shadow-lg mb-32">

        {/* Referral Information Card */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg flex items-center">
        <UserPlus className="text-white mr-3 text-6xl" size={50}/>
          <div>
            <h2 className="text-lg font-semibold text-white">Invite Friends!</h2>
            <p className="text-gray-300">
              Invite a friend to get <span className="text-green-400 font-bold">1000 BGRM</span>!
              Your friend gets <span className="text-green-400 font-bold">500 BGRM</span> as well!
            </p>
          </div>
        </div>

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
              className="bg-white text-black px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Clipboard className="text-black" />
              <span className="text-sm sm:text-base">Copy Link</span>
            </button>
            <button
              onClick={shareReferralLink}
              className="bg-white text-black px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Share className="text-black" />
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
                  className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <UserPlus className="text-white" />
                    <span className="text-base sm:text-lg font-semibold text-gray-200">{friend}</span>
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-yellow-400"> +20</span>
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
