"use client";

import React, { useState, useEffect, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners'; // Import new white task icon

// Import Lucide icons for YouTube, Twitter, Telegram, etc.
import { Youtube, Twitter, MessageCircle, Gift, Users, PartyPopper } from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [claimedTasks, setClaimedTasks] = useState(new Set()); // Track claimed tasks
  const { user, setUser } = useContext(globalContext); // Get user data from context
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, {
          headers: {
            "Authorization": process.env.NEXT_PUBLIC_TOKEN
          }
        });
        if (response.data.res) {
          setTasks(response.data.data);
        } // Assuming tasks are in `data` key
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleClaim = async (task) => {
    if (!hasCompletedTask(task.text)) {
      try {
        if (task?.url) {
          window.open(task.url);
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/validate`, {
          telegram_id: user.telegram_id,
          reward: task.reward,
          text: task.text,
          url: task.url,
          type: task.type
        }, {
          headers: {
            "Authorization": process.env.NEXT_PUBLIC_TOKEN
          }
        });

        if (res.data.res) {
          toast.success('Tokens claimed successfully!');
          setClaimedTasks(prev => new Set(prev).add(task.text)); // Update claimed tasks
          setUser(res.data.user);
        } else {
          toast.error('Complete the task');
        }

      } catch (error) {
        console.error('Error claiming task:', error);
        toast.error('Error claiming tokens');
      }
    }
  };

  const hasCompletedTask = (text) => {
    return user.tasks.includes(text);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getIconByTaskType = (task) => {
    switch (task.type) {
      case 'youtube':
        return <Youtube className="text-red-600 text-xl" />;
      case 'twitter':
        return <Twitter className="text-blue-400 text-xl" />;
      case 'join_channel':
        return <MessageCircle className="text-blue-500 text-xl" />;
      case 'free':
        return <Gift className="text-yellow-400 text-xl" />;
      case 'invite_3':
      case 'invite_5':
      case 'invite_15':
      case 'invite_30':
        return <Users className="text-green-500 text-xl" />;
      default:
        return <PartyPopper className="text-purple-400 text-xl" />;
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader color="#ffffff" size={15} />
      </div>
    );
  }

  if (!user || !user.username || loading) {
    setLoading(true);
    return null;
  }

  const incompleteTasks = tasks.filter(task => !hasCompletedTask(task.text));
  const completedTasks = tasks.filter(task => hasCompletedTask(task.text));

  return (
    <div className="bg-black min-h-screen p-6 pb-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tasks</h1>
      <div className="max-w-4xl mx-auto">
        {/* Incomplete Tasks Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complete Tasks</h2>
          {incompleteTasks.length === 0 ? (
            <p className="text-center text-white">No tasks available.</p>
          ) : (
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-[#2E8B57] border border-green-600 rounded-lg p-3 shadow-lg flex flex-col items-start justify-between hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    {/* Make icons white */}
                    {React.cloneElement(getIconByTaskType(task), { className: "text-white" })}
                    <span className="text-base font-semibold text-white">{task.text}</span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-medium text-white">Reward: {formatNumber(task.reward)}</span>
                      <img src="/logo.png" alt="Bangaram Logo" className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => handleClaim(task)}
                      disabled={hasCompletedTask(task.text)} // Disable button if task is completed
                      className={`px-3 py-1 rounded-lg transition-all duration-300 ${hasCompletedTask(task.text)
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-200 shadow-lg'
                        }`}
                    >
                      {hasCompletedTask(task.text) ? 'Claimed' : 'Claim'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <p className="text-center text-white">No completed tasks.</p>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-[#2E8B57] border border-green-600 rounded-lg p-3 shadow-lg flex flex-col items-start justify-between"
                >
                  <div className="flex items-center space-x-2">
                    {React.cloneElement(getIconByTaskType(task), { className: "text-white" })}
                    <span className="text-base font-semibold text-white">{task.text}</span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-medium text-white">Reward: {formatNumber(task.reward)}</span>
                      <img src="/logo.png" alt="Bangaram Logo" className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>





  );
};

export default TasksPage;
