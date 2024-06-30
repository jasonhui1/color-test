import React, { createContext, useContext, useState } from 'react';

// Create a context for history
const SettingContext = createContext(undefined);

// Create a provider component
export const SettingProvider = ({ children }) => {
    const [practicing, setPracticing] = useState(true);
    const [saveToHistory, setSaveToHistory] = useState(false);
    const [difficulties, setDifficulties] = useState('easy');
    const [mode, setMode] = useState('normal');
    const [testNum, setTestNum] = useState(25)

    return (
        <SettingContext.Provider value={{
            practicing, setPracticing,
            saveToHistory, setSaveToHistory,
            difficulties, setDifficulties,
            mode, setMode,
            testNum, setTestNum
        }}>
            {children}
        </SettingContext.Provider>
    );
};

// Custom hook to use the history context
export const useSettings = () => {
    const context = useContext(SettingContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingProvider');
    }
    return context;
};