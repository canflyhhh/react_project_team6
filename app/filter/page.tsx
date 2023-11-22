'use client'
import React, { useState } from "react";
import usePosts from "./test_page";
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

function PostsList() {
  const [tag, setTag] = useState("");
  const [posts, setPosts] = usePosts(tag);
  

  const handleButtonClick = (selectedTag: string) => {
    setTag(selectedTag);
  };

  return (
    <div>
      <button onClick={() => handleButtonClick("貿易")}>校內</button>
      <button onClick={() => handleButtonClick("琥珀")}>校外</button>

      <ul>   
        <Grid container spacing={2} sx={{ padding: 4 }}>
          {posts.map((posts, index) => (
            <Grid item xs={4}>
              <Card variant="outlined">
                <li key={index}>
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
                </li>
              </Card>
            </Grid>
          ))}
        </Grid>  
      </ul>
    </div>
  );
}

export default PostsList;

