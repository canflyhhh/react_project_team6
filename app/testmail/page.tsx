'use client'
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

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
  return (
    <div>
      <div>
        <TextField
          type="email"
          name="email"
          value={message.email}
          placeholder="請輸入信箱..."
          onChange={handleChange}
          autoComplete="email"
        />
      </div>
      <div>
        <TextField
          type="text"
          name="subject"
          value={message.subject}
          placeholder="請輸入信件主題..."
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          type="text"
          name="html"
          value={message.html}
          placeholder="請輸入信件內容..."
          onChange={handleChange}
        />
      </div>
      <div>{response}</div>
      <Button onClick={handleClick}>
        送出
      </Button>
    </div>
  )
}