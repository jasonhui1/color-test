import { getQueryKey, querySupabase } from "./common";
import supabase from "./setup";

const tableName = 'color_test_history';

let memoizedResults = {
    params: null,
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 60000; // 1 minute cache

export async function getHistory({testId = null, mode = 'normal', limit = Infinity }) {

    const queryParams = { testId, mode, limit};
    const queryKey = getQueryKey(queryParams);

    if (
        memoizedResults.params === queryKey &&
        Date.now() - memoizedResults.timestamp < CACHE_DURATION
    ) {
        return memoizedResults.data;
    }

    let query = supabase
        .from(tableName)
        .select('*')
        .order('timestamp', { ascending: false });

    if (testId) query = query.eq('testId', testId);
    if (mode) query = query.eq('mode', mode);
    if (Number.isFinite(limit)) query = query.limit(limit);

    const data = await querySupabase(query);

    memoizedResults = {
        params: queryKey,
        data,
        timestamp: Date.now()
    };
    console.log('data :>> ', data);

    return data;
}

export async function addHistory({ testId, targetColor, selectedColor, mode = 'normal', difficulty, refColor = null, correct, time, testMethod }) {

    const newEntry = {
        testId,
        targetColor,
        selectedColor,
        mode,
        difficulty,
        refColor,
        correct,
        time,
        testMethod
    };

    await querySupabase(
        supabase
            .from(tableName)
            .insert([newEntry])
    );

    memoizedResults.timestamp = 0;
    console.log('added :>> ',);
}

// export async function clearResults() {
//     await querySupabase(
//         supabase
//             .from(tableName)
//             .delete()
//             .not('id', 'is', null)
//     );

//     memoizedResults.timestamp = 0;
// }

// New function to query by color properties
// export async function getHistoryByColorProperty(property, value, { testId, mode = 'normal', last = Infinity }) {
//     const query = supabase
//         .from(tableName)
//         .select('*')
//         .order('timestamp', { ascending: false });

//     // Add filters for the color property
//     query.or(`targetColor->${property}.eq.${value},selectedColor->${property}.eq.${value},refColor->${property}.eq.${value}`);

//     if (testId) query.eq('testId', testId);
//     if (mode) query.eq('mode', mode);
//     if (Number.isFinite(last)) query.limit(last);

//     return await querySupabase(query);
// }

// addHistory(1, { h: 180, s: 50, l: 50 }, { h: 185, s: 55, l: 52 }, 'normal', 'easy', { h: 0, s: 100, l: 50 });

