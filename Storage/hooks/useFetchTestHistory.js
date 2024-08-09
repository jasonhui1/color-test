import { useState, useEffect } from 'react';
import { getHistory } from '../../lib/supabase/testHistory';

export async function fetchTestHistory({ testId, mode, limit=null }) {
    try {
        const data = await getHistory({ testId, mode, limit });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch histories:');
    }
}

export const useFetchHistory = (testId, mode) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!testId) return
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const histories = await fetchTestHistory({ testId, mode });
                console.log('histories :>> ', histories);
                setHistory(histories);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [testId, mode]);

    return { history, loading, error };
};
