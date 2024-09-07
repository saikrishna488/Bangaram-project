"use client";

import React, { useState, useEffect, useContext } from 'react';
import { globalContext } from '../../contextapi/GlobalContext'; // Context file
import axios from 'axios'; // For API calls
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToClaim, setTaskToClaim] = useState(null);
  const [claimedTasks, setClaimedTasks] = useState(new Set()); // Track claimed tasks
  const { user, setUser } = useContext(globalContext); // Get user data from context

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`); // Use environment variable
        setTasks(response.data.data || []); // Assuming tasks are in `data` key
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (taskToClaim) {
      // Call the API to evaluate the task when the taskToClaim changes
      const claimTokens = async () => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/validate`, {
            username: user.username, // Include username or other necessary data
            reward: taskToClaim.reward,
            text: taskToClaim.text
          });
          toast('Tokens claimed successfully!');
          setClaimedTasks(prev => new Set(prev).add(taskToClaim.text)); // Update claimed tasks
          setUser(prevUser => ({
            ...prevUser,
            tasks: [...prevUser.tasks, taskToClaim.text] // Update user tasks locally
          }));
          setTaskToClaim(null);
        } catch (error) {
          console.error('Error claiming task:', error);
          toast('Error claiming tokens');
        }
      };

      claimTokens();
    }
  }, [taskToClaim, user.username]);

  const handleClaim = (task) => {
    if (!hasCompletedTask(task.text)) {
      setTaskToClaim(task); // Set the task to be claimed
      if (task.text === 'Connect Your wallet') {
        // Special handling for wallet connection task
        if (user.wallet_address) {
          // User has connected wallet, reward them
          setTaskToClaim({ ...task, reward: 10 }); // Assume the reward for wallet connection is 10 tokens
        } else {
          toast('Please connect your wallet to claim tokens.');
          setTaskToClaim(null);
        }
      } else {
        window.open(task.url, '_blank'); // Open the task URL in a new tab for other tasks
      }
    }
  };

  const hasCompletedTask = (text) => {
    return claimedTasks.has(text) || user.tasks.includes(text);
  };


  return (
    <div className="dark:bg-gray-900 bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Tasks</h1>
      <div className="max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complete Tasks</h2>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task._id} className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-200">{task.text}</span>
                <button
                  onClick={() => handleClaim(task)}
                  disabled={hasCompletedTask(task.text)} // Disable button if task is completed
                  className={`px-4 py-2 rounded-lg transition ${
                    hasCompletedTask(task.text)
                      ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {hasCompletedTask(task.text) ? 'Claimed' : 'Claim'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default TasksPage;
