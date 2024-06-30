import superbaseClient from "./supabase_client";
const supabase = superbaseClient;

const tableName = 'color_test';

async function querySupabase(query) {
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getTestSB( last = Infinity ) {
    let query = supabase
        .from(tableName)
        .select('*')
        .order('timestamp', { ascending: false });

    // if (Number.isFinite(last)) query = query.limit(last);
    const data = await querySupabase(query);

    console.log('tests :>> ', data);
    return data;
}

export async function addTestSB(hRange, lRange, sRange, name = 'Unnamed') {
    const newEntry = {
        hRange,
        lRange,  // Store directly as {h,s,l} object
        sRange,  // Store directly as {h,s,l} object
        name,
    };

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

