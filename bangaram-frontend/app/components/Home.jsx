"use client";

import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const { user, setUser } = useContext(globalContext);
  const [loading, setLoading] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getTelegramUsername = () => {
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return {
          telegramUsername: 'captain488',
          telegram_id: '74547451578',
          start: '',
          photo_url: 'https://example.com/photo.jpg' // Sample photo URL for development
        };
      }

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe.user.username;
        const telegram_id = window.Telegram.WebApp.initDataUnsafe.user.id;
        const start = window.Telegram.WebApp.initDataUnsafe.start_param;
        const photo_url = window.Telegram.WebApp.initDataUnsafe.user.photo_url;
        return { telegramUsername, telegram_id, start, photo_url };
      }

      return null;
    };

    const fetchUser = async () => {
      const { telegramUsername, telegram_id, start, photo_url } = getTelegramUsername();

      if (telegramUsername) {
        setUsername(telegramUsername);
        setPhotoUrl(photo_url);

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
            telegram_id,
            username: telegramUsername,
            start: start
          }, {
            headers: {
              "Authorization": process.env.NEXT_PUBLIC_TOKEN
            }
          });
          const data = res.data.user;
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        console.log('Username not found, still loading...');
      }

      setLoading(false);
    };

    if (!username) {
      fetchUser();
    }

  }, [username]);

  const handleClaimReward = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/daily-reward`, { username }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });
      if (res.data.msg) {
        setUser(res.data.user);
        setRewardClaimed(true);
        toast.success('Reward claimed');
      } else {
        if (res.data.remainingTime) {
          toast.success("Come back in " + res.data.remainingTime);
        } else {
          toast.error("Failed to claim tokens");
        }
      }

    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Error occurred");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!user || !user.username) {
    setLoading(true);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black to-gray-900 text-white px-4 py-8 pb-48">
      {/* User Profile Card */}
      <div className="bg-black bg-opacity-90 p-4 md:p-6 lg:p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg text-center border border-gray-800 mb-8">
        <div className="flex flex-col items-center mb-4">
          {
            photoUrl ? (
              <img
                src={photoUrl}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
              />
            ) : (
              <FaUserCircle size={60} className="text-gray-500 mb-2" />
            )
          }
          
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-1">{user.username}</h1>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg flex items-center justify-center">
          <img
            src="/logo.png" // Replace with actual logo path
            alt="Bangaram Logo"
            width={25}
            height={25}
            className="mr-2"
          />
          <span className="text-lg md:text-xl font-semibold">{user.tokens}</span>
        </div>
      </div>

      {/* Daily Reward Section */}
      <div className="bg-black bg-opacity-90 p-4 md:p-6 lg:p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg text-center border border-gray-800">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">Daily Reward</h2>
        <p className="text-sm md:text-base lg:text-lg mb-4">Claim your daily reward of 10 Bangaram tokens!</p>
        <button
          onClick={handleClaimReward}
          className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold ${rewardClaimed ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700'} text-black transition duration-300 ease-in-out`}
          disabled={rewardClaimed}
        >
          {rewardClaimed ? 'Reward Claimed' : 'Claim Reward'}
        </button>
      </div>
    </div>
  );
};

export default Home;
