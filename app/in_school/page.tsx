'use client'
import React, { useContext, useState } from "react";
import {inOutPosts} from "./all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack } from "@mui/material";

// 圖片
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { query, where } from "firebase/firestore";

// import heart
import Heart from "react-heart"

function InSchool() {
    
    // 篩選校外  
    const [posts, setPosts, like] = inOutPosts("校內");

    // 詳細內容
    const [status, setStatus] = useState("校內");
    const [Id, setId] = useState("");
    const [context, setContext, d_like] = useDetails(Id);

    const detailContex = (id: string) => {
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

    // 卡片收藏
    const likecheck = (postId: string, isHeart: boolean) => {
        const check = isHeart
          ? window.confirm('確定收藏文章？')
          : window.confirm('確定取消收藏？');
        if (check) {
          like(postId, isHeart)
        }
      }

    //詳細資訊收藏
    const d_likecheck = (postId: string, isHeart: boolean) => {
      const check = isHeart
        ? window.confirm('確定收藏文章？')
        : window.confirm('確定取消收藏？');
      if (check) {
        d_like(postId, isHeart)
      }
    }

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
                                    {/*顯示收藏數量*/} 
                                    {post.like ? (
                                        <Typography>{`收藏量: ${post.like}`}</Typography>
                                    ) : (
                                        <Typography>收藏量: 0</Typography>
                                    )}
                                    <CardActions>
                                        {/*點擊收藏*/}  
                                        <div style={{ width: "1.5rem", marginRight: '0.5rem', marginLeft: '1.5rem'}}>
                                          <Heart
                                            isActive={post.isHeart}
                                            onClick={() => likecheck(post.Id, !post.isHeart)}
                                            activeColor="red"
                                            inactiveColor="black"
                                            animationTrigger="hover"
                                            animationScale={1.5}
                                          />
                                        </div>
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
                            {/*顯示tag(多tag & 只有個tag)*/} 
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
                            {/*顯示收藏數量*/} 
                            {item.like ? (
                                <Typography>{`收藏量: ${item.like}`}</Typography>
                            ) : (
                                <Typography>收藏量: 0</Typography>
                            )}
                            {/*點擊收藏*/}
                            <div style={{ width: "1.5rem", marginRight: '0.5rem', marginLeft: '1.5rem'}}>
                              <Heart
                                isActive={item.isHeart}
                                onClick={() => d_likecheck(item.Id, !item.isHeart)}
                                activeColor="red"
                                inactiveColor="black"
                                animationTrigger="hover"
                                animationScale={1.5}
                              />
                            </div>
                        </div>
                    ))}
                    <Button variant="outlined" onClick={goBack}>返回校外總攬</Button>
                </div>
            )}
        </div>
    );
}

export default InSchool;

