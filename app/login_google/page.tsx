'use client';
import { signInWithGooglePopup } from "./login"
const SignIn = () => {
const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }
return (
        <div>
            <button onClick={logGoogleUser}>login with Google</button>
        </div>
    )
}
export default SignIn;
