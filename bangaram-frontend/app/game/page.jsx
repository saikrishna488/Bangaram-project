"use client"
import React, { useState } from 'react';
import { FaDollarSign, FaGift, FaCoins } from 'react-icons/fa';

const SpinTheWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Prize data with colors and labels
  const prizes = [
    { label: '10 BGRM', icon: <FaCoins />, color: 'bg-yellow-300' },
    { label: '50 BGRM', icon: <FaCoins />, color: 'bg-green-300' },
    { label: '0.5 USDT', icon: <FaDollarSign />, color: 'bg-blue-300' },
    { label: '1 USDT', icon: <FaDollarSign />, color: 'bg-purple-300' },
    { label: '100 BGRM', icon: <FaGift />, color: 'bg-pink-300' },
    { label: '10 BGRM', icon: <FaCoins />, color: 'bg-yellow-300' },
  ];

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Determine prize based on random chance (90% chance for 10 BGRM)
    const rand = Math.random();
    let prizeIndex = rand < 0.9 ? 0 : 1; // Adjust prizeIndex based on probability
    setPrize(prizes[prizeIndex].label);

    // Spin logic
    const segmentAngle = 360 / prizes.length;
    const angle = 3600 + segmentAngle * prizeIndex; // Rotation with added full spins
    setRotation(angle);

    setTimeout(() => {
      setSpinning(false);
    }, 3000); // Match CSS animation duration
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-200 to-blue-200">
      <h1 className="text-4xl font-bold mb-4">Spin the Wheel</h1>

      <div className="relative w-72 h-72">
        {/* Wheel */}
        <div
          className={`w-full h-full rounded-full border-8 border-gray-700 transform transition-transform duration-[3000ms] ease-out ${spinning ? 'spin' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Segments of the wheel */}
          {prizes.map((prize, index) => (
            <div
              key={index}
              className={`absolute w-1/2 h-1/2 origin-bottom-left ${prize.color}`}
              style={{
                transform: `rotate(${(360 / prizes.length) * index}deg)`,
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="transform rotate-[-90deg] text-center">
                  {prize.icon}
                  <p className="text-lg font-semibold">{prize.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pointer */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-10 bg-red-500 transform -translate-x-1/2 -translate-y-full"
          style={{ zIndex: 1 }}
        ></div>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="mt-8 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Spin
      </button>

      {/* Display prize */}
      {prize && (
        <div className="mt-4 text-2xl font-bold text-green-600">
          You won: {prize}
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spin {
          animation: spin 3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SpinTheWheel;
