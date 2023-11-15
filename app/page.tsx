'use client'
import * as React from 'react';
import usePosts from './post/usePosts';
import { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

export default function Home() {
  // Destructure posts and setPosts from the usePosts hook
  const [posts, setPosts] = usePosts();
  return (
    <Grid container spacing={2}  sx={{ padding: 4 }}>
        {posts.map((post) => (
            <Grid item xs={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {post.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {post.account}
                        </Typography>
                        <Typography variant="body2">
                            {post.context}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>
    
  );
}
