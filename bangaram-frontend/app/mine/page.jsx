"use client";
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file

const Mine = () => {
  const { user } = useContext(globalContext); // Retrieve user from context
  const router = useRouter(); // Initialize router
  const games = [
    { 
      id: 1, 
      name: 'Game 1', 
      tokens: 150, 
      icon: '/game-icons/game1.png', 
      description: 'A thrilling adventure game with multiple levels and rewards.' 
    },
    { 
      id: 2, 
      name: 'Game 2', 
      tokens: 200, 
      icon: '/game-icons/game2.png', 
      description: 'Solve puzzles and earn tokens in this brain-teasing game.' 
    },
    { 
      id: 3, 
      name: 'Game 3', 
      tokens: 250, 
      icon: '/game-icons/game3.png', 
      description: 'Compete in challenges and collect rewards with each victory.' 
    },
    // Add more games as needed
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 relative">
      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
      >
        Go Back
      </button>
      
      {/* User Token Display */}
      <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
        <img
          src="/logo.png"
          alt="Token"
          className="w-6 h-6"
        />
        <span className="text-lg font-semibold">{user?.tokens?.toLocaleString() || '0'}</span>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Mine</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Tokens display */}
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <img
                src="/logo.png"
                alt="Token"
                className="w-4 h-4"
              />
              <span>{game.tokens}</span>
            </div>
            
            {/* Game content */}
            <div className="p-4 flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-500 rounded-full mb-2">
                <img
                  src={game.icon}
                  alt={`${game.name} Icon`}
                  className="w-12 h-12"
                />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-center">{game.name}</h2>
              <p className="text-sm text-gray-400 mb-4 text-center">{game.description}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mine;
