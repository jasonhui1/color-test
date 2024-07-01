import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { changeSettings, getSettings } from '../Storage/test_settings';

// Create a context for history
const SettingContext = createContext(undefined);

// Create a provider component
export const SettingProvider = ({ children }) => {
    const [practicing, setPracticing] = useState(true);
    const [saveToHistory, setSaveToHistory] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [mode, setMode] = useState('normal');
    const [testNum, setTestNum] = useState(25)

    const [initial, setInitial] = useState(true)

    useEffect(() => {
        const settings = getSettings()

        if (settings) {
            setPracticing(settings.practicing)
            setSaveToHistory(settings.saveToHistory)
            setDifficulty(settings.difficulty)
            setMode(settings.mode)
            setTestNum(settings.testNum)
        }

        setInitial(false)
    }, [])


    useEffect(() => {
        if (!initial) {
            changeSettings({ practicing, saveToHistory, difficulty, mode, testNum })
        }
    }, [practicing, saveToHistory, difficulty, mode, testNum])

    return (
        <SettingContext.Provider value={{
            practicing, setPracticing,
            saveToHistory, setSaveToHistory,
            difficulties: difficulty, setDifficulties: setDifficulty,
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