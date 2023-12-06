'use client'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, use, useEffect, useState } from "react";
import app from "@/app/_firebase/config"

export const AuthContext = createContext({
  email: '',
  photo: '',
});
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = getAuth(app);
  const [authData, setAuthData] = useState({ email: '', photo: '' });

  // const [email, setEmail] = useState('');

  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthData({
        email: user.email ? user.email: "",
        photo: user.photoURL ? user.photoURL: "",
      });
    }
    else {
      setAuthData({ email: "", photo: "" });
    }

    //console.log(user);
    
    return () => {
      unsub();
    }
  }
  );
  useEffect(unsub, [unsub]);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};