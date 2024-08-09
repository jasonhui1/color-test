import { useState, useEffect } from 'react';
import { getTests } from '../../lib/supabase/testParams';

export async function fetchTestsAPI(userId) {
    try {
        const data = await getTests({ userId });
        return data;

    } catch (error) {
        throw new Error('Failed to fetch tests:');
    }
}

export const useFetchTests = (userId) => {
    const [createdTests, setCreatedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTest = async () => {
        try {
            setLoading(true);
            const tests = await fetchTestsAPI(userId);
            setCreatedTests(tests);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTest();
    }, [userId]);

    return { createdTests, loading, error, refetch: fetchTest };
}