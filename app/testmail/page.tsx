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
  const divStyle = {
    padding: '50px',
  };
  const textFieldStyle = {
    padding: '5px',
  }

  return (
    <div style={divStyle}>
      <h3>有什麼需要協助的嗎? 寄信讓我們知道吧！</h3>
      <div style={textFieldStyle}>
        <TextField
          type="email"
          name="email"
          value={message.email}
          placeholder="請輸入信箱..."
          onChange={handleChange}
          autoComplete="email"
        />
      </div>
      <div style={textFieldStyle}>
        <TextField
          type="text"
          name="subject"
          value={message.subject}
          placeholder="請輸入信件主題..."
          onChange={handleChange}
        />
      </div>
      <div style={textFieldStyle}>
        <TextField
          type="text"
          name="html"
          multiline
          rows={4}
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