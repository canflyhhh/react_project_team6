'use client'
import * as React from 'react';
import usePosts from './post/usePosts';
import { useEffect } from 'react';
import { 
    Grid, Card, CardContent, Typography, CardActions, Button, Slide, 
    TransitionProps, Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent , useMediaQuery 
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';


export default function Home() {
  // Destructure posts and setPosts from the usePosts hook
  const [posts, setPosts] = usePosts();
  const router = useRouter();

  return (
    <Grid container spacing={2} sx={{ padding: 4 }}>
        {posts.map((post) => (
            <Grid item xs={4}>
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
                        <Button variant="outlined" onClick={() => router.push(`/post_content`)}>
                            查看內容
                        </Button>
                    </CardActions>
                </Card>
                {post.id}
            </Grid>
        ))}
    </Grid>
    
  );
}
