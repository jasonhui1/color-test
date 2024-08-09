import supabase from "../../lib/supabase/setup";

async function handleSignInWithGoogle(response) {
    const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
    })
    // const { data: { user } } = await supabase.auth.getUser()
    // console.log('user :>> ', user);
}

// Assign the function to the window object
if (typeof window !== "undefined") {
    window.handleSignInWithGoogle = handleSignInWithGoogle;
}

const GoogleLogin = () => {

    return (
        <>
            <div id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </>
    )
}

export default GoogleLogin