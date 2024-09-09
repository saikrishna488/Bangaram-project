"use client";
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { globalContext } from '@/contextapi/GlobalContext';
import { toast } from 'react-toastify';

const AdminAuth = () => {
  const { key, setKey } = useContext(globalContext);
  const [localKey, setLocalKey] = useState("")
  const [loading, setLoading] = useState(false);

  const checkAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/admin', { key :localKey }, {
        headers: {
          "Authorization": process.env.NEXT_PUBLIC_TOKEN
        }
      });
      console.log(res.data)
      if (res.data.msg) {
        setKey(localKey);
        toast.success('Admin verified successfully');
      } else {
        toast.error('Invalid key. Access denied.');
      }
    } catch (error) {
      toast.error('Error verifying admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    
  },[])

  // Return null if key is already set (admin authenticated)
  if (key) {
      return null;
    }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Admin Login</h2>
        <form onSubmit={checkAdmin} className="flex flex-col space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black" // Changed to dark:text-white
            placeholder="Enter admin key"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
