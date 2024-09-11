"use client";
import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../../contextapi/GlobalContext'; // Context file
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import DailyRewardCard from './DailyRewardCard';
import EarnCard from './EarnCard';
import WalletButton from './WalletButton';
import { BeatLoader } from 'react-spinners';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
      <BeatLoader color="#ffffff" size={15} />
    </div>
    );
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
          <span className="text-lg md:text-xl font-semibold">{user.tokens.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions Section */}
      <div className='w-full flex justify-center relative'>
        <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 px-4">
          <DailyRewardCard 
            username={username} 
            setUser={setUser} 
            rewardClaimed={rewardClaimed} 
            setRewardClaimed={setRewardClaimed} 
          />
          <EarnCard />
        </div>
      </div>

      {/* Wallet Button */}
      <WalletButton walletAddress={user.wallet_address} />
    </div>
  );
};

export default Home;
