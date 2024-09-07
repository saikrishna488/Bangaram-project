"use client"
import React, { createContext, useState } from 'react';

// Create a UserContext
export const globalContext = createContext();

// Create a UserProvider to wrap the app
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: 'JohnDoe',
        tokens: 100,
        tasks : ["Join our Telegram channel"],
        wallet_address: ""
    });

    return (
        <globalContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </globalContext.Provider>
    );
};
