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
  const [username, setUsername] = useState(null); // State to store username
  const searchParams = useSearchParams();
  const start = searchParams.get("start") || '';

  useEffect(() => {
    const getTelegramUsername = () => {
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return {
          telegramUsername: 'captain488',
          telegram_id: '745290157'
        };
      }

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe.user.username;
        const telegram_id = window.Telegram.WebApp.initDataUnsafe.user.username;
        return { telegramUsername, telegram_id };
      }

      return null;
    };

    const fetchUser = async () => {
      const { telegramUsername, telegram_id } = getTelegramUsername();

      if (telegramUsername) {
        setUsername(telegramUsername);

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

      setLoading(false); // Set loading to false when done
    };

    fetchUser();
  }, []);



  // useEffect(() => {

  //   if(user.username){
  //     const fetchRewards = async () => {
  //       const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/daily-reward`, {
  //         username: username,
  //       }, {
  //         headers: {
  //           "Authorization": process.env.NEXT_PUBLIC_TOKEN
  //         }
  //       });
  //       const data = res.data;
  //       console.log(data)
  //       if (!data.msg) {
  //         setRewardClaimed(true)
  //       }
  //       else{
  //         setRewardClaimed(false)
  //       }
  //     }
  
  //     fetchRewards()
  //   }
  // }, [user])

  const handleClaimReward = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/daily-reward`, { username }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });
      if (res.data.msg == true) {
        setUser(res.data.user);
        setRewardClaimed(true);
        toast.success('Reward claimed');
      }

      if (res.data.remainingTime) {
        toast.success("Come back in " + res.data.remainingTime)
      }
      else {
        toast("Error occured")
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast("Error occured ")
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!user && !user.username) {
    setLoading(true)
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 overflow-hidden pb-20">
      {/* User Info Section */}
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg text-center mb-8 border border-gray-700">
        {/* User Icon and Name */}
        <div className="flex flex-col items-center mb-4">
          <FaUserCircle size={80} className="text-gray-400 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.username}</h1>
        </div>

        {/* Bangaram Balance Section */}
        <div className="relative p-4 md:p-6 bg-gray-700 rounded-full shadow-lg mb-8 flex items-center justify-center">
          <img
            src="logo.png" // Replace with actual logo path
            alt="Bangaram Logo"
            width={40}
            height={40}
            className="mx-2"
          />
          <span className="text-xl md:text-2xl font-semibold">{user.tokens} BGRM</span>
        </div>
      </div>

      {/* Daily Reward Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-center border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Daily Reward</h2>
        <p className="mb-4 text-lg">Claim your daily reward of 10 Bangaram tokens!</p>
        <button
          onClick={handleClaimReward}
          className={`px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold text-white ${rewardClaimed ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={rewardClaimed}
        >
          {rewardClaimed ? 'Reward Claimed' : 'Claim Reward'}
        </button>
      </div>
    </div>
  );
};

export default Home;
