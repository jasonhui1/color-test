import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { changeSettings, getSettings } from '../Storage/test_settings';
import { stepInDifficulty } from '../Utils/utils';

// Create a context for history
const SettingContext = createContext(undefined);

// Create a provider component
export const SettingProvider = ({ children }) => {
    const [practicing, setPracticing] = useState(true);
    const [saveToHistory, setSaveToHistory] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [mode, setMode] = useState('normal');
    const [testNum, setTestNum] = useState(25)

    const [testMethod, setTestMethod] = useState('exact')
    const [useColorWheel, setUseColorWheel] = useState(true)

    const [initial, setInitial] = useState(true)

    useEffect(() => {
        const settings = getSettings()

        if (settings) {
            if (settings.practicing) setPracticing(settings.practicing)
            if (settings.saveToHistory) setSaveToHistory(settings.saveToHistory)
            if (settings.difficulty) setDifficulty(settings.difficulty)
            if (settings.mode) setMode(settings.mode)
            if (settings.testNum) setTestNum(settings.testNum)
            if (settings.testMethod) setTestMethod(settings.testMethod)

            if (settings.useColorWheel) setUseColorWheel(settings.useColorWheel)
        }

        setInitial(false)
    }, [])


    useEffect(() => {
        if (!initial) {
            changeSettings({ practicing, saveToHistory, difficulty, mode, testNum, testMethod, useColorWheel })
        }
    }, [practicing, saveToHistory, difficulty, mode, testNum, testMethod, useColorWheel])

    return (
        <SettingContext.Provider value={{
            practicing, setPracticing,
            saveToHistory, setSaveToHistory,
            difficulty, setDifficulty,
            mode, setMode,
            testNum, setTestNum,
            step: stepInDifficulty(difficulty),
            testMethod, setTestMethod,
            useColorWheel: useColorWheel,
            toggleUseColorWheel: () => { setUseColorWheel(!useColorWheel) },

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