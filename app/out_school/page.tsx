'use client'
import * as React from 'react';
import { useState, useContext, useEffect } from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Breadcrumbs, Divider } from "@mui/material";
import { inOutPosts } from "../in_school/all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import app from "@/app/_firebase/config"
import { CalendarMonth, AdsClick, ArrowBack, Interests, Person } from '@mui/icons-material';

// 圖片
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import heart
import Heart from "react-heart"
import '../QuillEditor.css'; // import your custom styles

function OutSchool() {

    // 篩選校外  
    const [posts, setPosts, like] = inOutPosts("校外");

    // 詳細內容
    const [status, setStatus] = useState("校外");
    const [Id, setId] = useState("");
    const [context, setContext, d_like] = useDetails(Id);

    const detailContex = (id: string) => {
        setStatus("詳細");
        setId(id);
    }

    const goBack = () => {
        setStatus("校外");
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
            {status === "校外" && (
                <div>
                    {/*校內文章*/}
                    <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
                        <Interests sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'orange' }} />
                        ReactGOGO 校外文章一覽
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
                    <Grid container marginY={'3em'} justifyContent='flex-end'>
                        <Pagination
                            count={Math.ceil(posts.length / postsPerPage)}
                            page={page}
                            variant="outlined"
                            color="primary"
                            onChange={handleChangePage}
                            sx={{ marginRight: '16px' }}
                        />
                    </Grid>

                </div>

            )}

            {status === "詳細" && Id && (
                <div>
                    {context.map((item) => (
                        <Card variant="outlined" sx={{ padding: '1em' }} key={Id} >
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" marginTop={'1em'} marginBottom={'0.5em'} display={'flex'} alignItems={'center'} >
                                    <Person sx={{ fontSize: '1.5rem', marginRight: '0.2em', color: 'Orange' }} />
                                    {item.account}
                                </Typography>
                                <Typography variant="h4" component="div" sx={{ marginBottom: '0.5em' }} fontWeight={'bold'} >
                                    {item.title}
                                </Typography>
                                <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: '1em' }}>
                                    {item.tag &&
                                        (Array.isArray(item.tag) ? (
                                            item.tag.map((tagItem, index) => (
                                                <React.Fragment key={index}>
                                                    <Typography sx={{ display: 'flex', alignItems: 'center', color: "orange" }}>
                                                        {tagItem.trim()}
                                                    </Typography>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <Typography>
                                                {item.tag}
                                            </Typography>
                                        ))
                                    }
                                </Breadcrumbs>
                                <Divider />
                                <Typography variant="body2" sx={{ marginY: '1em' }}>
                                    {item.time.toDate().toLocaleString()}
                                </Typography>
                                <ReactQuill
                                    theme="snow"
                                    value={item.context}
                                    modules={{
                                        toolbar: false,
                                    }}
                                    formats={[
                                        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                                        'list', 'bullet', 'indent',
                                        'link', 'image',
                                    ]}
                                    readOnly={true}
                                />
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between' }}>
                                <Button variant="outlined" sx={{ alignItems: 'center' }} onClick={goBack} startIcon={<ArrowBack />} size="large">
                                    返回校外總覽
                                </Button>
                                <Typography sx={{ width: "6em", margin: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/*點擊收藏*/}
                                    <span style={{ width: "1.5rem" }}>
                                        <Heart
                                            isActive={item.isHeart}
                                            onClick={() => d_likecheck(item.Id, !item.isHeart)}
                                            activeColor="red"
                                            inactiveColor="black"
                                            animationTrigger="hover"
                                            animationScale={1.2}
                                        />
                                    </span>
                                    {/* 收藏量 */}
                                    <span style={{ marginLeft: '0.5em' }}>
                                        {item.like ? item.like : 0}
                                    </span>
                                </Typography>
                            </CardActions>
                        </Card>
                    ))}


                </div>
            )}
        </div>
    )
}

export default OutSchool;
