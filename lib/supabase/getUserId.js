import supabase from "./setup";

export const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user.id;
}