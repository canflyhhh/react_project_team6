'use client'
import axios from "axios";
import { useState } from "react";
import {
  Grid, Card, CardContent, Typography, CardActions, Button, TextField, Divider, CardMedia, Icon
} from "@mui/material";
import { Email, Send } from '@mui/icons-material';
import { AuthContext } from '../account/authContext';
import { useContext } from 'react';



export default function TestEmail() {
  // 取得現在的帳號
  const authContext = useContext(AuthContext);

  // 回傳寄送內容
  const [message, setMessage] = useState({senderEmail: authContext.email || '', email: '', subject: '', html: '' });
  const [response, setResponse] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  }
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setResponse('送信中...');
    try {
      const response = await axios({
        method: 'post',
        url: '/email',
        data: message,
      });
      setResponse(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(error.message);
      } else {
        setResponse("錯誤");
      }

    }
  }

  return (
    <Grid container spacing={2} sx={{ padding: 10 }}>
      <Card variant="outlined" sx={{ margin: '0 auto', width: '60%', padding: 2 }}>
        <CardMedia
          component="img"
          height="250"
          image="./Mail-cuate.png"
          alt="send email to us"
        />
        <CardContent>
          <Typography variant="h5" component="div" sx={{marginY: 4}}>
            <Email sx={{ marginRight: 1 }} />有什麼需要協助的嗎? 寄信告訴我們吧！
          </Typography>
          <Divider sx={{ marginY: 4 }} ></Divider>
          <Grid container direction="column" rowSpacing={1}>
            <Grid item direction="row">
              <Typography color="text.secondary">
                您的信箱：
              </Typography>
              <TextField
                type="email"
                name="senderEmail"
                value={message.senderEmail} // Use the value from the component's state
                placeholder="請輸入信箱..."
                autoComplete="email"
                sx={{ width: '100%' }}
                onChange={handleChange}
                required
                disabled
              />
            </Grid>
            <Grid item>
              <Typography color="text.secondary">
                主旨：
              </Typography>
              <TextField
                type="text"
                name="subject"
                placeholder="請輸入信件主旨..."
                sx={{ width: '100%' }}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item>
              <Typography color="text.secondary">
                內文：
              </Typography>
              <TextField
                type="text"
                name="html"
                multiline
                rows={5}
                placeholder="請輸入信件內容..."
                sx={{ width: '100%' }}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end'}}>
          <Button variant="contained" onClick={handleClick}  sx={{ width: '30%' }}>
            送 出 郵 件
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}