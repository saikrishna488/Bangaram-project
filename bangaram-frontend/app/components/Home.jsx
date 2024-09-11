"use client";

import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const { user, setUser } = useContext(globalContext);
  const [loading, setLoading] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getTelegramUsername = () => {
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return {
          telegramUsername: 'captain488',
          telegram_id: '74547451578',
          start: '',
          photo_url: '' // Sample photo URL for development
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

  const handleGoToEarn = () => {
    router.push('/earn'); // Redirect to the "Earn" page
  };

  // Format the token balance with commas
  const formatTokens = (tokens) => {
    return tokens.toLocaleString();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!user || !user.username) {
    setLoading(true);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8">
        {
          photoUrl ? (
            <img
              src={photoUrl}
              alt="User"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 mb-4"
            />
          ) : (
            <FaUserCircle size={60} className="text-gray-500 mb-4" />
          )
        }
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-1">{user.username}</h1>
        <div className="flex items-center bg-black p-3 rounded-lg mb-8">
          <img
            src="/logo.png" // Replace with actual logo path
            alt="Bangaram Logo"
            width={30}
            height={30}
            className="mr-2"
          />
          <span className="text-lg md:text-xl font-semibold">{formatTokens(user.tokens)}</span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        {/* Daily Reward Card */}
        <div className="bg-black p-4 md:p-6 lg:p-6 rounded-lg text-center min-w-[160px] flex-shrink-0 border border-gray-800">
          <h2 className="text-lg md:text-xl lg:text-xl font-bold mb-2">Daily Reward</h2>
          <p className="text-sm md:text-base lg:text-base mb-4">Claim your daily reward of 10 Bangaram tokens!</p>
          <button
            onClick={handleClaimReward}
            className={`px-4 py-2 md:px-4 md:py-2 rounded-full font-semibold ${rewardClaimed ? 'bg-white text-black cursor-not-allowed' : 'bg-white text-black'} transition duration-300 ease-in-out`}
            disabled={rewardClaimed}
          >
            {rewardClaimed ? 'Reward Claimed' : 'Claim Reward'}
          </button>
        </div>

        {/* Earn Card */}
        <div className="bg-black p-4 md:p-6 lg:p-6 rounded-lg text-center min-w-[160px] flex-shrink-0 border border-gray-800">
          <h2 className="text-lg md:text-xl lg:text-xl font-bold mb-2">Earn More Bangaram</h2>
          <p className="text-sm md:text-base lg:text-base mb-4">Participate in games and quizzes to earn more Bangaram tokens!</p>
          <button
            onClick={handleGoToEarn}
            className="px-4 py-2 md:px-4 md:py-2 rounded-full font-semibold bg-white text-black transition duration-300 ease-in-out"
          >
            Earn Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
