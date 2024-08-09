import { useState, useEffect } from "react";
import { getUserId } from "../lib/supabase/getUserId";

export const useUserId = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchUserId() {
        try {
            setLoading(true);
            const id = await getUserId();
            setUserId(id);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserId()
    }, [])

    return { userId, loading, error };
}