'use client'
import * as React from 'react';
import usePosts from './post/usePosts';
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


export default function Home() {
  // Destructure posts and setPosts from the usePosts hook
  const [posts, setPosts] = usePosts();
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


  return (
    <div>
    {status === "總攬" && (
        <Grid container spacing={2} sx={{ padding: 4 }}>
            {posts.map((post, index) => (
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
                                ? `${post.context.substring(0, 50)}……`
                                : post.context}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" onClick={() => detailContex(post.id)}>查看內容</Button>
                        </CardActions>
                        <div>{post.datetime.toLocaleString()}</div>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )}
    
    {status === "詳細" && Id && (
        <div>
            {context.map((item) => (
                <div key={Id}>
                    <div>{item.title}</div>
                    <div>{item.account}</div>
                    <div>{item.time.toDate().toLocaleString()}</div>
                    <div>{item.context}</div>
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
