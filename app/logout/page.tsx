'use client';
import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import app from '@/app/_firebase/config';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        alert("登出成功，返回主頁面！");
        await auth.signOut();
        
        router.push('/');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Logout error:', error.message);
        } else {
          console.error('Unexpected logout error:', error);
        }
      }
    };
    logout();
  }, [auth, router]); 

  return (
    <div>
      
    </div>
  );
};

export default Logout;
