"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EarnCard = () => {
  const router = useRouter();

  const handleGoToEarn = () => {
    toast.info("Coming Soon..");
    // router.push('/earn'); // Uncomment to redirect to the "Earn" page
  };

  return (
    <div className="bg-black p-4 md:p-6 lg:p-6 rounded-lg text-center w-[350px] flex-shrink-0 border border-gray-800">
      <h2 className="text-lg md:text-xl lg:text-xl font-bold mb-2">Earn More Bangaram</h2>
      <p className="text-sm md:text-base lg:text-base mb-4">Participate in games and quizzes to earn more Bangaram tokens!</p>
      <button
        onClick={handleGoToEarn}
        className="px-4 py-2 md:px-4 md:py-2 rounded-full font-semibold bg-white text-black transition duration-300 ease-in-out"
      >
        Earn Now
      </button>
    </div>
  );
};

export default EarnCard;
