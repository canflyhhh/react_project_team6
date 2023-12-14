'use client'
import React, { useState } from "react";
import usePosts from "../in_school/all_school_data";
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack } from "@mui/material";

function PostsList() {
  const [posts, setPosts] = usePosts("標籤一");
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  const handleChangePage = (event: React.ChangeEvent<unknown>, value:number) => {
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <ul>   
        <Grid container spacing={2} sx={{ padding: 4 }}>
          {currentPosts.map((posts, index) => (
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
        <Stack spacing={2} mt={3}>
          <Pagination
            count={Math.ceil(posts.length / postsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      </ul>
    </div>
  );
}

export default PostsList;

