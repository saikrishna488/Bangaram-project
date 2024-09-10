"use client";

import React, { useState, useEffect, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import { toast } from 'react-toastify';
import { FaClipboardList } from 'react-icons/fa'; // Import clipboard list icon

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
        }); // Use environment variable
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

        if (res.data.msg) {
          toast.success('Tokens claimed successfully!');
          setClaimedTasks(prev => new Set(prev).add(task.text)); // Update claimed tasks
          setUser(res.data.user);
        } else {
          toast.error('Already claimed');
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

  if (!user || !user.username || loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-black to-gray-900 min-h-screen p-6 pb-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tasks</h1>
      <div className="max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complete Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks available.</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-black bg-opacity-80 p-4 rounded-lg shadow-md flex items-center justify-between 
                             border border-blue-600 dark:border-purple-600 hover:border-pink-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <FaClipboardList className="text-yellow-400" /> {/* Task icon */}
                    <span className="text-lg font-semibold text-gray-200">{task.text}</span>
                  </div>
                  <button
                    onClick={() => handleClaim(task)}
                    disabled={hasCompletedTask(task.text)} // Disable button if task is completed
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      hasCompletedTask(task.text)
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white hover:from-yellow-600 hover:to-yellow-800 shadow-lg glow-effect'
                    }`}
                  >
                    {hasCompletedTask(task.text) ? 'Claimed' : 'Claim'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
