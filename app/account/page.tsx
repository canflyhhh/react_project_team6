'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Grid, Typography, InputLabel, Divider } from '@mui/material';
import styles from '../page.module.css';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from "@/app/_firebase/config";
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { signInWithGooglePopup } from "./admin"; // google login
import { useRouter } from 'next/navigation';
import { AuthContext } from './authContext';
import BadgeIcon from '@mui/icons-material/Badge';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import axios from "axios";

export default function Account() {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const [account, setAccount] = useState({
        email: "", password: "", name: ""
    });
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("登入");

    const [emailMessage, setEmailMessage] = useState({ email: '', subject: 'ReactGOGO帳號註冊成功', html: '恭喜您註冊成功' });
    const [response, setResponse] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState("");

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

    // login - googleLogin
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        router.push('/');
        //console.log(response);
    }

    const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        console.log("status=", status);

        try {
            if (status === "註冊") {
                const res = await createUserWithEmailAndPassword(auth, account.email, account.password);
                const userDoc = await setDoc(doc(db, "users", res.user.uid), { email: account.email, name: account.name });

                // send email after register (不要刪)
                // try {
                //     emailMessage.email = account.email
                //     const response = await axios({
                //       method: 'post',
                //       url: '/email',
                //       data: emailMessage,
                //     });
                //     setResponse(response.data.message);
                // } catch (error) {
                //     if (axios.isAxiosError(error)) {
                //       setResponse(error.message);
                //     } else {
                //       setResponse("錯誤");
                //     }
                // }
                // setMessage(`註冊成功，歡迎 ${res.user?.email}`);


                // setAccount({ ...account, password: "" });

                //setMessage(`註冊成功，請再次輸入密碼來登入系統`);
                setStatus("註冊成功");
                // setRegisteredEmail(account.email);

                router.push('/');
            }
            else {
                const res = await signInWithEmailAndPassword(auth, account.email, account.password);
                setMessage(`登入成功，歡迎 ${res.user?.email}`);

                router.push('/');
            }
        }
        catch (e) {
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

    // useEffect(() => {
    //     setAccount({ email: "", password: "", name: "" });

    //     // 註冊後，自動代入帳號到登入頁面
    //     if (status === '註冊成功' && registeredEmail) {
    //         setAccount((prevAccount) => ({ ...prevAccount, email: registeredEmail }));
    //     }
    // }, [status, registeredEmail]);


    return (
        <div style={{ padding: '6em' }}>
            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContext: 'middle', height: '600px' }}>
                <Grid item xs={5} >
                    <Typography variant="h4" component="div"
                        sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <ConnectWithoutContactIcon sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred', marginBottom: '1em' }} />
                        註冊/登入 React GOGO！<br />和大家進行互動！
                    </Typography>
                    <img src="../../fju.jpg" alt="歡迎" style={{ width: '100%', height: 'auto' }} />
                </Grid>
                <Grid item sx={{ paddingX: '2em', alignSelf: 'flex-end' }} xs={7}>
                    <form style={{ padding: '2em' }}>
                        {(status === '登入') &&
                            <div>
                                <Typography variant="h5" component="div"
                                    sx={{ marginY: '2em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                    登入帳號
                                </Typography>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                                    <InputLabel htmlFor="tagInput">電子郵件信箱：</InputLabel>
                                    <TextField
                                        type="email"
                                        name="email"
                                        value={account.email}
                                        placeholder="電子郵件信箱"
                                        onChange={handleChange}
                                        autoComplete='username'
                                        style={{ width: '500px' }}
                                    />
                                    <InputLabel htmlFor="tagInput">密碼：</InputLabel>
                                    <TextField
                                        type="password"
                                        name="password"
                                        value={account.password}
                                        placeholder="密碼"
                                        onChange={handleChange}
                                        autoComplete='current-password'
                                        style={{ width: '500px' }}
                                    />
                                </div>
                                <div>
                                    <Button
                                        variant="contained" onClick={handleSubmit}
                                        sx={{ width: '100%', marginBottom: '0.5em', marginTop: '2em' }}
                                        style={{ width: '100%' }} size='large'>
                                        {status}
                                    </Button>
                                    <Divider sx={{ marginY: '0.5em' }} />
                                    <Button
                                        variant="contained" onClick={logGoogleUser}
                                        sx={{ width: '100%', marginBottom: '0.5em' }}
                                        size='large'>
                                        使用 Google 帳號登入
                                    </Button>
                                    <Button
                                        variant="outlined" onClick={changeStatus}
                                        sx={{ width: '100%', marginBottom: '0.5em' }}
                                        size='large'>
                                        還沒有帳號，我要註冊
                                    </Button>
                                </div>

                            </div>


                        }

                        {(status === '註冊') &&
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                                    <InputLabel htmlFor="tagInput">我的暱稱：</InputLabel>
                                    {status === '註冊' &&
                                        <TextField
                                            type="text" name="name" value={account.name}
                                            placeholder="暱稱" onChange={handleChange}
                                            sx={{ width: '500px', marginBottom: '0.5em' }} />
                                    }
                                    <InputLabel htmlFor="tagInput">註冊電子郵件：</InputLabel>

                                    <TextField type="email" name="email" value={account.email}
                                        placeholder="電子郵件信箱" onChange={handleChange} autoComplete='username'
                                        sx={{ width: '500px', marginBottom: '0.5em' }} />
                                    <InputLabel htmlFor="tagInput">設定密碼：</InputLabel>
                                    <TextField type="password" name="password" value={account.password}
                                        placeholder="密碼" onChange={handleChange} autoComplete='current-password'
                                        sx={{ width: '500px', marginBottom: '0.5em' }} />
                                </div>

                                <br></br>

                                <div>
                                    <Button variant="contained" onClick={handleSubmit} sx={{ width: '100%', marginBottom: '0.5em', marginTop: '2em' }} size='large'>
                                        {status}
                                    </Button>
                                    <Divider sx={{ marginY: '0.5em' }} />
                                    <Button variant="outlined" onClick={changeStatus} sx={{ width: '100%', marginY: '0.5em' }} size='large'>
                                        已經註冊，我要登入
                                    </Button>
                                </div>
                            </div>
                        }
                        <div>{message}</div>

                    </form>
                </Grid>
            </Grid>
        </div>
    )
}