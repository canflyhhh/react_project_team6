import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "@/app/_firebase/Config";
import { getFirestore } from "firebase/firestore";


// Initialize Firebase
const firebaseApp = getFirestore(app);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);