"use client"

import React, { useState, useEffect, useRef } from 'react';

const DropGame = () => {
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);

  const dropFrequency = 500; // Coin drop frequency in milliseconds
  const coinSpeed = 5;       // Speed of falling coins
  const coinSize = 60;       // Set the coin size (width and height)
  const coinsPerDrop = 3;    // Number of coins to drop each time
  const requestRef = useRef(); // For requestAnimationFrame

  // Generate multiple coins periodically
  useEffect(() => {
    const dropInterval = setInterval(() => {
      const newCoins = [];
      for (let i = 0; i < coinsPerDrop; i++) {
        const newCoin = {
          id: Date.now() + i, // Ensure unique IDs
          x: Math.random() * (window.innerWidth - coinSize),
          y: 0
        };
        newCoins.push(newCoin);
      }
      setCoins(prevCoins => [...prevCoins, ...newCoins]);
    }, dropFrequency);

    return () => clearInterval(dropInterval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Coin falling logic using requestAnimationFrame
  const animateCoins = () => {
    if (timeLeft > 0) { // Ensure coins fall only if time is left
      setCoins(prevCoins =>
        prevCoins.map(coin => ({ ...coin, y: coin.y + coinSpeed }))
      );
      requestRef.current = requestAnimationFrame(animateCoins);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateCoins);
    return () => cancelAnimationFrame(requestRef.current);
  }, [coinSpeed]);

  // Handle coin pointer events
  const handleCoinClick = (id) => {
    setScore(prevScore => prevScore + 1);
    setCoins(prevCoins => prevCoins.filter(coin => coin.id !== id));
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden" 
      style={{
        backgroundImage: `url('game_bg.jpeg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute top-4 left-4 text-xl font-bold text-white">Score: {score}</div>
      <div className="absolute top-4 right-4 text-xl font-bold text-white">Time Left: {timeLeft}s</div>
      
      {coins.map(coin => (
        <img
          key={coin.id}
          src="logo.png"
          alt="coin"
          className="absolute"
          onPointerDown={() => handleCoinClick(coin.id)} // Use pointer event for both mobile and desktop
          style={{
            top: `${coin.y}px`,
            left: `${coin.x}px`,
            width: `${coinSize}px`,
            height: `${coinSize}px`,
            userSelect: 'none',       // Prevent text selection
            pointerEvents: 'auto',    // Enable pointer events for clicking
            cursor: 'pointer',        // Pointer cursor for better UX
          }}
          draggable="false"  // Prevent image dragging
        />
      ))}

      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center text-white text-2xl">
          Game Over! Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default DropGame;
