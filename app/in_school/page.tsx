'use client'
import React, { useContext, useState } from "react";
import { inOutPosts } from "./all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack, Divider } from "@mui/material";
import { CalendarMonth, AdsClick, ArrowBack, School } from '@mui/icons-material';

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
        <div style={{ padding: '6em' }}>
            {status === "校內" && (
                <div>
                    {/*校內文章*/}
                    <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
                        <School sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'orange' }} />
                        ReactGOGO 校內文章一覽
                    </Typography>
                    <Grid container>
                        {currentPosts.map((post, index) => (
                            <Card variant="outlined" sx={{ padding: '1em', marginBottom: '1em', width: '100%' }} key={index}>
                                <CardContent>
                                    <Typography variant="h4" component="div" sx={{ marginY: 1 }} fontWeight={'bold'}>
                                        {post.title}
                                    </Typography>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5em' }}>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            {post.account}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            <CalendarMonth sx={{ fontSize: '1rem', marginRight: '0.2em' }} />
                                            {post.time.toDate().toLocaleString()}
                                        </Typography>
                                    </div>
                                    <Typography variant="body2">
                                        {post.context.length > 50
                                            ? `${stripHtmlTags(post.context).substring(0, 50)}……`
                                            : stripHtmlTags(post.context)
                                        }
                                    </Typography>
                                </CardContent>
                                <Divider />
                                {/*顯示收藏數量*/}
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Typography sx={{ width: "6em", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/*點擊收藏*/}
                                        <span style={{ width: "1.5rem" }}>
                                            <Heart
                                                isActive={post.isHeart}
                                                onClick={() => likecheck(post.Id, !post.isHeart)}
                                                activeColor="red"
                                                inactiveColor="black"
                                                animationTrigger="hover"
                                                animationScale={1.2}
                                            />
                                        </span>
                                        {/* Display the like count */}
                                        <span style={{ marginLeft: '0.5em' }}>
                                            {post.like ? post.like : 0}
                                        </span>
                                    </Typography>
                                    <Button variant="outlined" onClick={() => detailContex(post.Id)} startIcon={<AdsClick />} size="large">
                                        查看內容
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Grid>
                    <Grid container marginY={'3em'} display='flex' direction="row" justifyContent='space-between'>
                        <Grid item>
                            <Button variant="outlined" sx={{ alignItems: 'center' }} onClick={goBack} startIcon={<ArrowBack />} size="large">
                                返回校內總覽
                            </Button>
                        </Grid>
                        <Grid item spacing={2}>
                            <Pagination
                                count={Math.ceil(posts.length / postsPerPage)}
                                page={page}
                                variant="outlined"
                                color="primary"
                                onChange={handleChangePage}
                            />
                        </Grid>
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
                            <div style={{ width: "1.5rem", marginRight: '0.5rem', marginLeft: '1.5rem' }}>
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

