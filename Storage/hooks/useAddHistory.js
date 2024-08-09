import { useState, useEffect } from 'react';
import { addHistory } from '../../lib/supabase/testHistory';

export async function addHistoryAPI({ testId, targetColor, selectedColor, mode = 'normal', difficulty, refColor = null, correct, time, testMethod }) {
    try {
        const data = await addHistory({ testId, targetColor, selectedColor, mode, difficulty, refColor, correct, time, testMethod })
        return data;
    } catch (error) {
        console.error('Failed to add test:', error);
    }
}

export const useAddHistory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addHistory = async (props) => {
        try {
            setLoading(true);
            const testId = await addHistoryAPI(props);
            return testId
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { addHistory, loading, error, };
}