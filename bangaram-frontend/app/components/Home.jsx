"use client";

import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

const Home = () => {
  const { user, setUser } = useContext(globalContext);
  const [loading, setLoading] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [username, setUsername] = useState(null); // State to store username
  const searchParams = useSearchParams();
  const start = searchParams.get('start');

  useEffect(() => {
    // Function to retrieve username from Telegram
    const getTelegramUsername = () => {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe.user.username;
        return telegramUsername;
      }
      return null;
    };

    const fetchUser = async () => {
      const telegramUsername = getTelegramUsername();

      if (telegramUsername) {
        setUsername(telegramUsername); // Set username from Telegram

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${telegramUsername}?start=${start}`);
          const data = res.data.user;
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        console.log('Username not found, still loading...');
      }

      setLoading(false); // Set loading to false when done
    };

    fetchUser();
  },  [setUser]);

  const handleClaimReward = async () => {
    if (!username) {
      toast('Please wait, username is being loaded.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/claim-daily-reward`, { username });
      if (res.data.msg) {
        setUser((prevUser) => ({ ...prevUser, tokens: prevUser.tokens + 10 }));
        setRewardClaimed(true);
        toast('Reward claimed');
      } else {
        toast('Comeback tomorrow');
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="relative dark:bg-gray-900 bg-gray-800 min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-[length:200%_200%] animate-gradient"></div>

      {/* User Info Section */}
      <div className="bg-gray-900 dark:bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md text-center mb-8">
        {/* User Icon and Name */}
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle size={80} className="text-gray-300 dark:text-gray-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
        </div>

        {/* Bangaram Balance Section */}
        <div className="relative p-8 bg-gray-800 dark:bg-gray-700 rounded-full shadow-inner mb-8">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-30"></div>
          <div className="relative z-10">
            <span className="block text-4xl font-bold">Bangaram: {user.tokens}</span>
            <img
              src="logo.png" // Replace with actual logo path
              alt="Bangaram Logo"
              width={50}
              height={50}
              className="mx-auto mt-4"
            />
          </div>
        </div>
      </div>

      {/* Daily Reward Card */}
      <div className="bg-gray-900 dark:bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Daily Reward</h2>
        <p className="mb-4">Claim your daily reward of 10 Bangaram tokens!</p>
        <button
          onClick={handleClaimReward}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${rewardClaimed ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={rewardClaimed}
        >
          {rewardClaimed ? 'Reward Claimed' : 'Claim Reward'}
        </button>
        {rewardMessage && <p className="mt-4 text-red-500">{rewardMessage}</p>}
      </div>
    </div> 
  );
};

export default Home;
