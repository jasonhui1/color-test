import { useState, useEffect } from 'react';
import { createTest } from '../../lib/supabase/testParams';

export async function createTestAPI({ hRange, sRange, lRange, name }) {
    try {
        const response = await createTest({ hRange, sRange, lRange, name })

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to add test:', error);
    }
}

export const useCreateTests = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const createTest = async ({ hRange, sRange, lRange, name = 'Unnamed' }) => {
        try {
            setLoading(true);
            const testId = await createTestAPI({ hRange, sRange, lRange, name });
            return testId
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { createTest, loading, error, };
}