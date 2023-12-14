'use client'
import React, { useState } from "react";
import usePosts from "./all_school_data";
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

function PostsList() {
  const [posts, setPosts] = usePosts("輔大");

  return (
    <div>
      <ul>   
        <Grid container spacing={2} sx={{ padding: 4 }}>
          {posts.map((posts, index) => (
            <Grid item xs={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {posts.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {posts.account}
                  </Typography>
                  <Typography variant="body2">{posts.context}</Typography>
                    <p>Time: {posts.time.toDate().toLocaleString()}</p>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>  
      </ul>
    </div>
  );
}

export default PostsList;

