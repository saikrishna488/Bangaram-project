"use client";
import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../../contextapi/GlobalContext'; // Context file
import axios from 'axios';
import { User } from 'lucide-react'; // Importing User icon from Lucide
import WalletButton from './WalletButton';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Ticket } from 'lucide-react'; // Importing Ticket icon from Lucide

const Home = () => {
  const { user, setUser } = useContext(globalContext);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getTelegramUsername = () => {
      if (!process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return {
          telegramUsername: 'captain48802',
          telegram_id: '74656685634',
          start: '4672560395',
        };
      }

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe.user?.username || "";
        const telegram_id = window.Telegram.WebApp.initDataUnsafe.user?.id || "";
        const start = window.Telegram.WebApp.initDataUnsafe.start_param || "";
        window.Telegram.WebApp.setHeaderColor('#000000');
        window.Telegram.WebApp.setBackgroundColor('#000000');

        if(!telegramUsername){
          toast.error("create telegram username and comeback!")
          return null
        }

        return { telegramUsername, telegram_id, start };
      }

      return null;
    };

    const fetchUser = async () => {
      const { telegramUsername, telegram_id, start } = getTelegramUsername() || {};

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


  const handleGame = ()=>{
    if(user.tickets >0 ){
      router.push('/game')
    }
    else{
      toast.error("Invite Friends/ Wait Till Tomorrow")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8 relative">
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
            <User size={60} className="text-gray-500 mb-4" /> // Updated to Lucide User icon
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

      {/* Wallet Button */}
      <WalletButton walletAddress={user.wallet_address} />

      {/* Mini Card for the Game */}
      <div className="relative w-full max-w-xs mx-auto my-4">
        <div className="bg-cover bg-center rounded-lg border border-gray-400 shadow-lg transition-transform duration-300 transform hover:scale-105" style={{
          backgroundImage: "url('card_bg.png')", // Replace with actual game background image path
          height: '250px', // Set height for the card
        }}>
          <div className="flex flex-col justify-between h-full bg-black bg-opacity-60 rounded-lg p-4">
            <h2 className="text-xl font-bold text-center shadow-2xl text-white">Drop Game</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-white">
                <Ticket className="mr-2" size={20} /> {/* Ticket icon */}
                <span className="text-lg font-semibold">Tickets: {user.tickets || 0}</span>
              </div>
              <button
                onClick={handleGame}
                className="px-4 py-2 bg-white text-black font-semibold rounded-md shadow-md transition-all duration-300 ease-in-out hover:bg-gray-200"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
