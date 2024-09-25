"use client";
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';

const AdminUser = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [tokens, setTokens] = useState("");
  const [tickets, setTickets] = useState(0)
  const { key } = useContext(globalContext);

  const fetchUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user', { username }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });

      if (res.data.msg) {
        const data = res.data.user;
        setUser(data);
        toast.success("User retrieved successfully");
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error("Error fetching user");
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/update', {
        username,
        tokens
      }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });

      if (res.data.msg) {
        const data = res.data.user;
        setUser(data);
        toast.success("User updated successfully");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/delete', { username }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });

      console.log(res.data)
      if (res.data.msg) {
        toast.success("User deleted successfully");
        
      } else {
        toast.error("User Not found");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };


  const updateTickets = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updatetickets', { username,tickets }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });
      if (res.data.res) {
        toast.success("Tickets updated successfully");
        setUser(res.data.user)
      } else {
        toast.error("User Not found");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  if (!key) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">User Management</h2>

        {/* Fetch User Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Fetch User Details</h4>
          <form onSubmit={fetchUser} className="flex flex-col space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get User
            </button>
          </form>

          {user && user.username && (
            <div className="mt-6">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white">User Details</h5>
              <p className="text-gray-700 dark:text-gray-300">Username: {user.username}</p>
              <p className="text-gray-700 dark:text-gray-300">Tokens: {user.tokens}</p>
              <p className="text-gray-700 dark:text-gray-300">Tickets: {user.tickets}</p>
              <h6 className="text-gray-700 dark:text-gray-300">Invited Friends:</h6>
              {user.invited_friends && user.invited_friends.map((frd, index) => (
                <p key={index} className="text-gray-500 dark:text-gray-400">{index + 1}. {frd}</p>
              ))}
              <h6 className="text-gray-700 dark:text-gray-300">Completed Tasks:</h6>
              {user.tasks && user.tasks.map((task, index) => (
                <p key={index} className="text-gray-500 dark:text-gray-400">{index + 1}. {task}</p>
              ))}
              <p className="text-gray-700 dark:text-gray-300">Joined Date: {user.joined_date}</p>
              <p className="text-gray-700 dark:text-gray-300">Telegram ID: {user.telegram_id}</p>
              <p className="text-gray-700 dark:text-gray-300">Referral Num: {user.referral_num}</p>
            </div>
          )}
        </div>

        {/* Update Tokens Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Update Tokens</h4>
          <form onSubmit={updateUser} className="flex flex-col space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Tokens"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Tokens
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Update Tickets</h4>
          <form onSubmit={updateTickets} className="flex flex-col space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Tickets"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Tickets
            </button>
          </form>
        </div>

        {/* Delete User Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Delete User</h4>
          <form onSubmit={deleteUser} className="flex flex-col space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
