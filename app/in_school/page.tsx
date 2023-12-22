'use client'
import React, { useState } from "react";
import {inOutPosts} from "./all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack } from "@mui/material";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { query, where } from "firebase/firestore";



function InSchool() {
    // 篩選校外  
    const [posts, setPosts] = inOutPosts("校內");

    // 詳細內容
    const [status, setStatus] = useState("校內");
    const [Id, setId] = useState("");
    const [context, setContext] = useDetails(Id);

    const detailContex = (id: string) => {
        console.log("ID:", id)
        setStatus("詳細");
        setId(id);
    }

    const goBack = () => {
        setStatus("校內");
    }

    // 換頁
    const [page, setPage] = useState(1);
    const postsPerPage = 9;

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // 算頁數
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // 將html多元素轉化為純文字
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

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
                                                ? `${stripHtmlTags(post.context).substring(0, 50)}……`
                                                : stripHtmlTags(post.context)
                                            }
                                        </Typography>
                                    </CardContent>
                                    {post.like ? (
                                        <Typography>{`收藏量: ${post.like}`}</Typography>
                                    ) : (
                                        <Typography>收藏量: 0</Typography>
                                    )}
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
                            variant="outlined"
                            color="primary"
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
                            {item.tag &&
                                (Array.isArray(item.tag) ? (
                                    item.tag.map((tagItem, index) => (
                                        <React.Fragment key={index}>
                                            {index > 0 && ', '}
                                            {tagItem.trim()}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Typography>
                                        {item.tag}
                                    </Typography>
                                ))
                            }
                            {item.like ? (
                                <Typography>{`收藏量: ${item.like}`}</Typography>
                            ) : (
                                <Typography>收藏量: 0</Typography>
                            )}
                        </div>
                    ))}
                    <Button variant="outlined" onClick={goBack}>返回校外總攬</Button>
                </div>
            )}
        </div>
    );
}

export default InSchool;

