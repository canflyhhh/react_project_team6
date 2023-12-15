'use client'
import * as React from 'react';
import usePosts from "./in_school/all_school_data";
import { useEffect } from 'react';
import { useState } from "react";
import Image from 'next/image'
import useDetails from './detail_data';
import { 
    Grid, Card, CardContent, Typography, CardActions, Button, Slide, 
    Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent , useMediaQuery 
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function Home() {
    // Destructure posts and setPosts from the usePosts hook
    const [hot, setHot] = usePosts("like");
    const [time, setTime] = usePosts("datetime");
    console.log("time:", time)
    
    // 主畫面OR詳細
    const [status, setStatus] = useState("總攬");
    const [Id, setId] = useState("");
    const [context, setContext] = useDetails(Id);   
    function detailContex(id:string){
      setStatus("詳細");
      setId(id);
    }   
    function goBack() {
      setStatus("總攬");
    }   
    function stripHtmlTags(html: string) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };


  return (
    <div>
    {status === "總攬" && (
        <div>
        <Grid container spacing={2} sx={{ padding: 4 }}>
            {hot.map((post, index) => (
                <Grid item xs={4} key={index}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {post.title}
                            </Typography>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {post.account}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {/* {post.datetime} */}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body2">
                                {post.context.length > 50
                                    ? `${stripHtmlTags(post.context).substring(0, 50)}……`
                                    : stripHtmlTags(post.context)
                                }
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" onClick={() => detailContex(post.Id)}>查看內容</Button>
                        </CardActions>
                        <div>{post.time.toDate().toLocaleString()}</div>
                    </Card>
                </Grid>
            ))}
        </Grid>
        <hr />
        <Grid container spacing={2} sx={{ padding: 4 }}>
        {time.map((post, index) => (
            <Grid item xs={4} key={index}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {post.title}
                        </Typography>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {post.account}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {/* {post.datetime} */}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="body2">
                            {post.context.length > 50
                                ? `${stripHtmlTags(post.context).substring(0, 50)}……`
                                : stripHtmlTags(post.context)
                            }
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={() => detailContex(post.Id)}>查看內容</Button>
                    </CardActions>
                    <div>{post.time.toDate().toLocaleString()}</div>
                </Card>
            </Grid>
        ))}
        </Grid>
        </div>
    )}
    
    {status === "詳細" && Id && (
        <div>
            {context.map((item) => (
                <div key={Id}>
                    <div>{item.title}</div>
                    <div>{item.account}</div>
                    <div>{item.time.toDate().toLocaleString()}</div>
                    <ReactQuill
                        theme="snow"
                        value={item.context}
                        modules={{
                            toolbar: false,
                        }}
                        formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image'
                        ]}
                    />
                    {/* <div>{item.context}</div> */}
                    <div>{item.tag}</div>
                    {item.photo && (
                        <Image src={item.photo} alt="image" priority={true} height={300} width={300} />
                    )}
                </div>
            ))}
            <Button variant="outlined" onClick={goBack}>返回總攬</Button>
        </div>
    )}
  </div>
  );
}
