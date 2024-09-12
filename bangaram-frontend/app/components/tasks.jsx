"use client";

import React, { useState, useEffect, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import { toast } from 'react-toastify';
import { FiList } from 'react-icons/fi'; 
import { BeatLoader } from 'react-spinners';// Import new white task icon

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
        setTasks(response.data.data || []); // Assuming tasks are in `data` key
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
        if (task.type === "wallet") {
          if (!user.wallet_address) {
            toast.error("Connect wallet");
            return;
          }
        }
        else if(task.type === "free"){
        } else {
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
        console.log(res.data)

        if (res.data.msg) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
      <BeatLoader color="#ffffff" size={15} />
    </div>
    );
  }


  if (!user || !user.username || loading) {
    setLoading(true)
    return null
  }

  const incompleteTasks = tasks.filter(task => !hasCompletedTask(task.text));
  const completedTasks = tasks.filter(task => hasCompletedTask(task.text));

  return (
    <div className="bg-black min-h-screen p-6 pb-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tasks</h1>
      <div className="max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complete Tasks</h2>
          {incompleteTasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks available.</p>
          ) : (
            <div className="space-y-4">
              {incompleteTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-black border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col items-start justify-between
                             hover:border-gray-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <FiList className="text-white text-xl" /> {/* New white task icon */}
                    <span className="text-lg font-semibold text-gray-100">{task.text}</span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium text-gray-100">Reward: {formatNumber(task.reward)}</span>
                      <img src="/logo.png" alt="Bangaram Logo" className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() => handleClaim(task)}
                      disabled={hasCompletedTask(task.text)} // Disable button if task is completed
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        hasCompletedTask(task.text)
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

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <p className="text-center text-gray-400">No completed tasks.</p>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-black border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col items-start justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <FiList className="text-gray-400 text-xl" /> {/* Gray task icon */}
                    <span className="text-lg font-semibold text-gray-300">{task.text}</span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium text-gray-300">Reward: {formatNumber(task.reward)}</span>
                      <img src="/logo.png" alt="Bangaram Logo" className="w-6 h-6" />
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
