'use client'
import React, { useState } from "react";
import usePosts from "./all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack } from "@mui/material";


function PostsList() {
    // 篩選校外  
    const [posts, setPosts] = usePosts("輔大");

    // 詳細內容
    const [status, setStatus] = useState("校內");
    const [Id, setId] = useState("");
    const [context, setContext] = useDetails(Id);

    const detailContex = (id:string) => {
        console.log("ID:",id)
        setStatus("詳細");
        setId(id);
      }
    
    const goBack =() => {
        setStatus("校內");
      }
    
    // 換頁
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
        {status === "校內" && (
            <ul>   
          <Grid container spacing={2} sx={{ padding: 4 }}>
            {currentPosts.map((post, index) => (
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
                      <Button variant="outlined" onClick={() => detailContex(post.Id)}>查看內容</Button>
                  </CardActions>
                  <div>{post.time.toDate().toLocaleString()}</div>
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
            <Button variant="outlined" onClick={goBack}>返回校外總攬</Button>
        </div>
    )}
        </div>
    );
}

export default PostsList;

