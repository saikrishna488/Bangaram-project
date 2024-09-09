"use client";

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';

const LeaderBoard = () => {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [userRank, setUserRank] = useState({});
    const { user } = useContext(globalContext);

    useEffect(() => {
        const fetchUsers = async () => {
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
        }; 

        if (user?.username) {
            fetchUsers();
        }
    }, [user?.username]);

    if (!user?.username) {
        return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10 px-5 pb-20">
            <div className="max-w-4xl mx-auto">

                {/* User Rank Section */}
                {userRank && (
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                        <h4 className="text-2xl font-semibold mb-4">Your Rank</h4>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between text-lg">
                                <p className="font-medium">{userRank.rank}. {userRank.username}</p>
                                <p>{userRank.tokens} BGRM</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Section */}
                <h2 className="text-4xl font-bold text-center mb-8">Leaderboard</h2>
                <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-24">
                    <h4 className="text-2xl font-semibold mb-4">Top Users</h4>
                    <div className="space-y-4">
                        {leaderboard.length ? leaderboard.map((user, index) => (
                            <div key={index} className="flex justify-between p-2 border-b border-gray-700">
                                <p className="text-lg font-medium">{index + 1}. {user.username}</p>
                                <p className="text-lg">{user.tokens} BGRM</p>
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
