import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUserId } from '../Hooks/useUserId';

// Create a context for history
const UserContext = createContext(undefined);

// Create a provider component
export const UserContextProvider = ({ children }) => {
    const { userId, loading, error } = useUserId()

    return (
        <UserContext.Provider value={{
            userId, loading, error
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the history context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a UserContext');
    }
    return context;
};