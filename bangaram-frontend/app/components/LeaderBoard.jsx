"use client";

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';
import { BeatLoader } from 'react-spinners';

const LeaderBoard = () => {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [userRank, setUserRank] = useState({});
    const { user } = useContext(globalContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!user?.username) {
            setLoading(true);
        }
        const fetchUsers = async () => {
            setLoading(true);
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
            setLoading(false);
        };

        if (user?.username) {
            fetchUsers();
        }
    }, [user?.username]);

    const formatTokens = (tokens) => {
        return new Intl.NumberFormat().format(tokens);
    };

    if (!user?.username) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BeatLoader color="#ffffff" size={15} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">

                {/* User Rank Section */}
                {userRank && (
                    <div className="bg-black border border-gray-700 shadow-lg rounded-lg p-6 mb-8">
                        <h4 className="text-2xl font-semibold mb-4 text-base sm:text-xl">Your Rank</h4>
                        <div className="p-4 bg-black rounded-lg">
                            <div className="flex items-center justify-between text-sm sm:text-lg">
                                <div className="flex items-center">
                                    <p className="font-medium text-sm sm:text-base mr-2">{userRank.rank}. {userRank.username}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="mr-2 text-sm sm:text-base">{formatTokens(userRank.tokens)}</p>
                                    <img src="logo.png" alt="Bangaram Logo" className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Section */}
                <h2 className="text-3xl font-bold text-center mb-8 text-xl sm:text-3xl">Leaderboard</h2>
                <div className="space-y-4">
                    {leaderboard.length ? leaderboard.map((user, index) => (
                        <div key={index} className="bg-black border border-gray-700 rounded-lg flex items-center p-4 shadow-md">
                            <div className="flex-1">
                                <p className="text-sm sm:text-base font-medium">{index + 1}. {user.username}</p> {/* Reduced font size */}
                            </div>
                            <div className="flex items-center">
                                <p className="mr-2 text-sm sm:text-base font-bold">{formatTokens(user.tokens)}</p>
                                <img src="logo.png" alt="Bangaram Logo" className="w-6 h-6" />
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-400">No users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
