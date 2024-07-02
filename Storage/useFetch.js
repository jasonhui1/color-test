import { useState, useEffect } from 'react';
import { getTestSB } from './test_parameters_sb';
import { getHistorySB } from './test_history_supabase';

export const useFetchTests = () => {
    const [createdTests, setCreatedTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const tests = await getTestSB();
                setCreatedTests(tests);
            } catch (error) {
                console.error("Failed to fetch tests", error);
            }
        };

        fetchTests();
    }, []);

    return createdTests;
};

export const useFetchHistory = (testId, mode) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const tests = await getHistorySB({ testId, mode });
                setHistory(tests);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };

        fetchHistory();
    }, [testId, mode]);

    return history;
};
