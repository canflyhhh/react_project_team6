'use client'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, use, useEffect, useState } from "react";
import app from "@/app/_firebase/config"

export const AuthContext = createContext('email');
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      setEmail(user.email ? user.email : "");
    }
    else {
      setEmail("");
    }

    console.log("user: ", user);
    return () => {
      unsub();
    }
  }
  );
  useEffect(unsub, [unsub]);

  return (
    <AuthContext.Provider value={email}>
      {children}
    </AuthContext.Provider>
  );
};