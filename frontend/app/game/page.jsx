"use client"

import { globalContext } from '@/contextapi/GlobalContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const DropGame = () => {
    const [coins, setCoins] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(40);
    const { user, setUser } = useContext(globalContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const dropFrequency = 400
    const coinSpeed = 6
    const coinSize = 60; // Set the coin size (width and height)
    const coinsPerDrop = 3
    const requestRef = useRef();  // For requestAnimationFrame

    // Generate coins periodically
    useEffect(() => {

        const dropInterval = setInterval(() => {
            const newCoins = [];
            for (let i = 0; i < coinsPerDrop; i++) {
                const newCoin = {
                    id: Date.now() + i, // Ensure unique IDs
                    x: Math.random() * (window.innerWidth - coinSize),
                    y: 0
                };
                newCoins.push(newCoin);
            }
            setCoins(prevCoins => [...prevCoins, ...newCoins]);
        }, dropFrequency);

        return () => clearInterval(dropInterval);
    }, []);

    // Timer logic
    useEffect(() => {

        const handleClaim = async () => {
            try {
                setLoading(true);

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/dropgame`,
                    {
                        username: user.username,
                        tokens: score,
                    },
                    {
                        headers: {
                            Authorization: process.env.NEXT_PUBLIC_TOKEN,
                        },
                    }
                );

                if (res.data.res) {
                    setUser(res.data.user);
                    toast.success("Claimed " + score + " BGRM successfully");
                    router.push("/");
                }
            } catch (err) {
                toast("Error occurred");
                console.log(err);
            } finally {
                router.push("/");
                setLoading(false);
            }
        };

        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearInterval(timer);
        }
        else {

            handleClaim()

        }
    }, [timeLeft]);







    // Coin falling logic using requestAnimationFrame
    const animateCoins = () => {
        setCoins(prevCoins =>
            prevCoins.map(coin => ({ ...coin, y: coin.y + coinSpeed }))
        );
        requestRef.current = requestAnimationFrame(animateCoins);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateCoins);
        return () => cancelAnimationFrame(requestRef.current);
    }, [coinSpeed]);

    // Handle coin touch/click
    const handleCoinClick = (id) => {
        setScore(score + 1);
        setCoins(coins.filter(coin => coin.id !== id));
    };






    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BeatLoader color="#ffffff" size={15} />
            </div>
        );
    }

    if (!user?.username) {
        setLoading(true)
    }


    return (
        <div
            className="relative h-screen w-screen overflow-hidden"
            style={{
                backgroundImage: `url('game_bg.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute top-4 left-4 text-xl font-bold text-white">Score: {score}</div>
            <div className="absolute top-4 right-4 text-xl font-bold text-white">Time Left: {timeLeft}s</div>

            {coins.map(coin => (
                <img
                    key={coin.id}
                    src="logo.png"
                    alt="coin"
                    className="absolute"
                    onTouchStart={() => handleCoinClick(coin.id)} // for mobile touch
                    onClick={() => handleCoinClick(coin.id)}     // for development/testing on desktop
                    style={{
                        top: `${coin.y}px`,
                        left: `${coin.x}px`,
                        width: `${coinSize}px`,
                        height: `${coinSize}px`,
                        userSelect: 'none',       // Prevent text selection
                        pointerEvents: 'auto',    // Enable pointer events for clicking
                        cursor: 'pointer',        // Pointer cursor for better UX
                    }}
                    draggable="false"  // Prevent image dragging
                />
            ))}

            {timeLeft === 0 && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center text-white text-2xl">
                    Game Over! Final Score: {score}
                </div>
            )}
        </div>
    );
};

export default DropGame;
