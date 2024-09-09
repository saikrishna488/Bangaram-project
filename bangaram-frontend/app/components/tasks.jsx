"use client";

import React, { useState, useEffect, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import { toast } from 'react-toastify';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [claimedTasks, setClaimedTasks] = useState(new Set()); // Track claimed tasks
  const { user, setUser } = useContext(globalContext); // Get user data from context

  useEffect(() => {
    const fetchTasks = async () => {
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

        // Open the task URL in a new tab for other tasks

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

  if (!user || !user.username) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-900 bg-gray-800 min-h-screen p-6 pb-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tasks</h1>
      <div className="max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complete Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks available.</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task._id} className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-200">{task.text}</span>
                  <button
                    onClick={() => handleClaim(task)}
                    disabled={hasCompletedTask(task.text)} // Disable button if task is completed
                    className={`px-4 py-2 rounded-lg transition ${hasCompletedTask(task.text)
                        ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
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
