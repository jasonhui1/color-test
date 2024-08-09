import { querySupabase } from "./common";
import supabase from "./setup";

const tableName = 'color_test';

export async function getTests({ userId, limit = Infinity }) {
    if (!userId) return [];
    let query = supabase
        .from(tableName)
        .select('*')
        .eq('userId', userId)
        .order('timestamp', { ascending: false });

    if (Number.isFinite(limit)) query = query.limit(limit);
    const data = await querySupabase(query);

    console.log('tests :>> ', data);
    return data;
}

export async function createTest({ hRange, lRange, sRange, name = 'Unnamed' }) {
    const newEntry = {
        hRange,
        lRange,
        sRange,
        name,
    };

    console.log('newEntry :>> ', newEntry);

    const { data, error } = await supabase
        .from(tableName)
        .insert([newEntry])
        .select();

    if (error) {
        throw error;
    }

    console.log('added test :>> ', data[0]);
    return data[0].id;
}

