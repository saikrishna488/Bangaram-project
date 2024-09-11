"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DailyRewardCard = ({ username, setUser, rewardClaimed, setRewardClaimed }) => {
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

  return (
    <div className="bg-black p-4 md:p-6 lg:p-6 rounded-lg text-center w-[350px] flex-shrink-0 border border-gray-800">
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
  );
};

export default DailyRewardCard;
