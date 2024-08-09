export async function querySupabase(query) {
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export function getQueryKey(params) {
    return JSON.stringify(params);
}