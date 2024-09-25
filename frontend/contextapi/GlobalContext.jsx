"use client"
import React, { createContext, useState } from 'react';

// Create a UserContext
export const globalContext = createContext();

// Create a UserProvider to wrap the app
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [key,setKey] = useState("");

    return (
        <globalContext.Provider value={{
            user,
            setUser,
            key,
            setKey
        }}>
            {children}
        </globalContext.Provider>
    );
};
