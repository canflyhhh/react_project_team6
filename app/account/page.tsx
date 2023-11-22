'use client'
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import styles from '../page.module.css'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from "@/app/_firebase/config"
import { FirebaseError } from 'firebase/app';

export default function Account() {
    const auth = getAuth(app);
    const [account, setAccount] = useState({ email: "", password: "", name: "" });
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("註冊");
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const changeStatus = function (e: React.MouseEvent<HTMLElement>) {
        if (status === "註冊") {
            setStatus("登入");
        }
        else {
            setStatus("註冊");
        }
    }

    const logout = function (e: React.MouseEvent<HTMLElement>) {
        auth.signOut();
        setMessage("登出成功");
    }
  
    const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        try {
            if (status === "註冊") {
                const res = await createUserWithEmailAndPassword(auth, account.email, account.password);
                setMessage(`註冊成功，歡迎 ${res.user?.email}`);
            }
            else {
                const res = await signInWithEmailAndPassword(auth, account.email, account.password);
                setMessage(`登入成功，歡迎 ${res.user?.email}`);
            }
        }
        catch(e) {
            if (e instanceof FirebaseError) {
                let message = "";
                switch (e.code) {
                    case "auth/email-already-in-use":
                        message = "電子信箱已註冊";
                        break;
                  case "auth/weak-password":
                        message = "密碼強度不足";
                        break;
                  case "auth/invalid-email":
                        message = "電子郵件格式錯誤";
                        break;
                  case "auth/user-not-found":
                        message = "電子郵件信箱不存在";
                        break;
                  case "auth/wrong-password":
                        message = "密碼錯誤";
                        break;
                  case "auth/too-many-requests":
                        message = "登入失敗次數過多，請稍後再試";
                        break;
                  default:
                    message = "系統錯誤:" + e.code;
                }
                setMessage(message);
            }
            else {
                if (e instanceof Error) {
                    setMessage(e.message);
                }
                else {
                    setMessage("系統錯誤");
                }
            }
        }
    
    }

    return (
        <div className={styles.main}> 

            <form>
                <div>
                    {status === '註冊' && <TextField type="text" name="name" value={account.name}
                        placeholder="姓名" label="姓名:" onChange={handleChange} />
                    }
                </div>
                <div>
                    <TextField type="email" name="email" value={account.email}
                    placeholder="電子郵件信箱" label="電子郵件信箱:" onChange={handleChange} autoComplete='username' />
                </div>
                <div>
                    <TextField type="password" name="password" value={account.password}
                    placeholder="密碼" label="密碼:" onChange={handleChange} autoComplete='current-password' />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>{status}</Button>
                </div>
                <div>{message}</div>
                
                <div>
                    <Button variant="contained" color="secondary" onClick={changeStatus}>
                    {status === '註冊' ? "已經註冊，我要登入" : "尚未註冊，我要註冊"}</Button>
                </div>

                &nbsp;       
                
                <div>
                    <Button variant="contained" color="secondary" onClick={logout}>登出</Button>
                </div>
            </form>

            
        </div>
    )
}