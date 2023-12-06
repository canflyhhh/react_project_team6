'use client';
import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import app from '@/app/_firebase/config';

const Logout = () => {
  const auth = getAuth(app);

  useEffect(() => {
    const logout = async () => {
      try {
        await auth.signOut();
        console.log('Logout successful');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Logout error:', error.message);
        } else {
          console.error('Unexpected logout error:', error);
        }
      }
    };
    logout();
  }, []); 

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
