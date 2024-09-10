"use client";

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';
import { FaUser } from 'react-icons/fa'; // Import user icon

const LeaderBoard = () => {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [userRank, setUserRank] = useState({});
    const { user } = useContext(globalContext);
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`, {
                    username: user?.username
                }, {
                    headers: {
                        "Authorization": process.env.NEXT_PUBLIC_TOKEN
                    }
                });

                const data = res.data;

                if (data.msg) {
                    setLeaderBoard(data.leaderboard);
                    setUserRank(data.userRank);
                } else {
                    toast.error("Error occurred while fetching leaderboard.");
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                toast.error("Error occurred while fetching leaderboard.");
            }
            setLoading(false)
        }; 

        if (user?.username) {
            fetchUsers();
        }
    }, [user?.username]);

    if (!user?.username) {
        return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    }

    if(loading){
        return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">

                {/* User Rank Section */}
                {userRank && (
                    <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-8">
                        <h4 className="text-2xl font-semibold mb-4">Your Rank</h4>
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between text-lg">
                                <div className="flex items-center">
                                    <p className="font-medium mr-2">{userRank.rank}. {userRank.username}</p>
                                    <FaUser className="text-gray-400" />
                                </div>
                                <div className="flex items-center">
                                    <p className="mr-2">{userRank.tokens}</p>
                                    <img src="logo.png" alt="Bangaram Logo" className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Section */}
                <h2 className="text-3xl font-bold text-center mb-8">Leaderboard</h2>
                <div className="bg-gray-900 shadow-lg rounded-lg p-6">
                    <h4 className="text-2xl font-semibold mb-4">Top Users</h4>
                    <div className="space-y-4">
                        {leaderboard.length ? leaderboard.map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center">
                                    <p className="text-lg font-medium mr-2">{index + 1}. {user.username}</p>
                                    <FaUser className="text-gray-400" />
                                </div>
                                <div className="flex items-center">
                                    <p className="mr-2">{user.tokens}</p>
                                    <img src="logo.png" alt="Bangaram Logo" className="w-5 h-5" />
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400">No users found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
