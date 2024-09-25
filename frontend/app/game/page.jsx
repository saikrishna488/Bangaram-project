"use client";

import { globalContext } from "@/contextapi/GlobalContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const CoinDropGame = () => {
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40); // Set initial time to 40 seconds
  const { user, setUser } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user?.tickets > 0) {
    router.push("/");
    toast.error("Invite Friends Get more Tickets");
  }

  // Function to generate coins at random intervals
  useEffect(() => {
    const interval = setInterval(() => {
      const newCoins = Array.from({ length: 3 }).map(() => ({
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5, // Ensure coins appear randomly in a valid range
        delay: Math.random() * 0.5,
        fallingSpeed: Math.random() * 1 + 5,
        isExploding: false,
        explosionPosition: { x: 0, y: 0 },
      }));
      setCoins((prevCoins) => [...prevCoins, ...newCoins]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Timer effect
  useEffect(() => {
    const handleClaim = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/dropgame`,
          {
            username: user.username,
            tokens: score,
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_TOKEN,
            }
          }
        );

        if (res.data.res) {
          setUser(res.data.user);
          toast.success("Claimed " + score + " BGRM successfully");
          router.push("/");
        }
      } catch (err) {
        toast("Error occurred");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleClaim();
    }
  }, [timeLeft]);

  // Handle coin click and allow multiple simultaneous taps
  const handleCoinClick = (id, event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    setCoins((prevCoins) =>
      prevCoins.map((coin) =>
        coin.id === id
          ? {
              ...coin,
              isExploding: true,
              explosionPosition: { x: clickX, y: clickY },
            }
          : coin
      )
    );

    // Do not block further clicks; score updates independently
    setTimeout(() => {
      setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== id));
    }, 500);
    
    // Update score immediately without waiting for setTimeout to complete
    setScore((prevScore) => prevScore + 10);
  };

  if (!user?.username) {
    return <h4>Loading...</h4>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader color="#ffffff" size={15} />
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col items-center justify-start select-none"
      style={{
        backgroundImage: `url('game_bg.jpeg')`, // Correctly set the background image
        backgroundSize: "cover", // Cover the whole container
        backgroundPosition: "center", // Center the image
      }}
    >
      <h1 className="text-3xl text-white font-bold mt-4">Score: {score}</h1>
      <h2 className="text-xl text-white">Time Left: {timeLeft}s</h2>
      <div className="relative w-full h-full">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={`absolute p-0 cursor-pointer ${
              coin.isExploding ? "hidden" : "animate-coin-drop"
            }`}
            style={{
              left: `${coin.x}%`,
              top: "-10%",
              animationDuration: `${coin.fallingSpeed}s`,
              animationDelay: `${coin.delay}s`,
              width: "60px", // Fixed width for the coin
              height: "60px", // Fixed height for the coin
              transition: "top 0s ease-in",
            }}
            onClick={(event) => handleCoinClick(coin.id, event)}
          >
            <img
              src={"logo.png"}
              alt="Coin"
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {coins
          .filter((coin) => coin.isExploding)
          .map((coin) => (
            <div
              key={coin.id}
              className="absolute text-red-500 text-6xl animate-explode"
              style={{
                left: `${coin.explosionPosition.x}px`,
                top: `${coin.explosionPosition.y}px`,
              }}
            >
              💥
            </div>
          ))}
      </div>
    </div>
  );
};

export default CoinDropGame;
