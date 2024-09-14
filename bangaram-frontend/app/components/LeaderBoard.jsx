"use client"
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';
import { BeatLoader } from 'react-spinners';

// Generate a random avatar URL using DiceBear API
const getAvatarUrl = (seed) => {
    const avatarStyles = [
        "avataaars", "adventurer", "big-ears", "big-smile", "bottts",
        "croodles", "micah", "pixel-art", "open-peeps"
    ]; // List of avatar styles
    const styleIndex = Math.floor(Math.random() * avatarStyles.length);
    const selectedStyle = avatarStyles[styleIndex];
    return `https://api.dicebear.com/6.x/${selectedStyle}/svg?seed=${seed}`;
};

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
        <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8 relative pb-24">
            <div className="max-w-4xl mx-auto">

                {/* User Rank Section */}
                {userRank && (
                    <div className="bg-gray-700 border border-gray-600 shadow-lg rounded-lg p-6 mb-8 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={getAvatarUrl(userRank.username)} // Avatar based on username
                                alt="User Avatar"
                                className="w-10 h-10 mr-4 rounded-full"
                            />
                            <div>
                                <p className="text-lg font-medium">{userRank.username}</p>
                                <div className="flex items-center">
                                    <p className="text-sm text-gray-400 mr-2">{formatTokens(userRank.tokens)}</p>
                                    <img
                                        src="/logo.png"
                                        alt="Bangaram Logo"
                                        className="w-6 h-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-bold">#{userRank.rank}</p>
                    </div>
                )}

                {/* Leaderboard Section */}
                <h2 className="text-3xl font-bold text-center mb-8">Leaderboard</h2>
                <div className="space-y-4">
                    {leaderboard.length ? leaderboard.map((leader, index) => (
                        <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-md flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={getAvatarUrl(leader.username)} // Avatar based on username
                                    alt="User Avatar"
                                    className="w-10 h-10 mr-4 rounded-full"
                                />
                                <div>
                                    <p className="text-lg font-medium">{leader.username}</p>
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-400 mr-2">{formatTokens(leader.tokens)}</p>
                                        <img
                                            src="/logo.png"
                                            alt="Bangaram Logo"
                                            className="w-6 h-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-bold">#{index + 1}</p>
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
