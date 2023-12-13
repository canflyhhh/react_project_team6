'use client'
import axios from "axios";
import { useState } from "react";
import {
  Grid, Card, CardContent, Typography, CardActions, Button, TextField, Divider, CardMedia, Icon
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

export default function TestEmail() {
  const [message, setMessage] = useState({ email: '', subject: '', html: '' });
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
  const divStyle = {
    padding: '50px',
  };
  const textFieldStyle = {
    padding: '5px',
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
          <Typography variant="h5" component="div">
            有什麼需要協助的嗎? 寄信讓我們知道吧！
          </Typography>
          <Divider sx={{ marginY: 4 }} ></Divider>
          <Grid container direction="column" rowSpacing={1}>
            <Grid item direction="row">
              <Typography color="text.secondary">
                信箱：
              </Typography>
              <TextField
                type="email"
                name="email"
                placeholder="請輸入信箱..."
                autoComplete="email"
                sx={{ width: '100%' }}
                onChange={handleChange}
                required
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
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleClick}>
            <EmailIcon sx={{ marginRight:1 }}/>送 出
          </Button>
        </CardActions>
      </Card>
      </Grid>
      )
}