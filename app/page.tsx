'use client'
import * as React from 'react';
import { usePosts } from "./in_school/all_school_data";
import { useEffect } from 'react';
import { useState } from "react";
import Image from 'next/image'
import useDetails from './detail_data';
import {
    Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack, Divider
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CalendarMonth, Whatshot, TouchApp, AdsClick, AutoAwesome, Margin } from '@mui/icons-material';


export default function Home() {
    // Limit限制顯示數量
    const [Limit, setLimit] = useState(true);
    //按熱度
    const [hot, setHot] = usePosts("like", Limit);
    //按時間
    const [time, setTime] = usePosts("datetime", Limit);

    // 主畫面OR詳細
    const [status, setStatus] = useState("總攬");
    const [Id, setId] = useState("");
    const [context, setContext] = useDetails(Id);

    //查看詳細資訊
    function detailContex(id: string) {
        setStatus("詳細");
        setId(id);
    }
    //從詳細資訊跳至總覽 
    function changeStatus(status: string) {
        if (status === "本月" || status === "熱門") {
            setStatus(status);
            setLimit(false)
            setPage(1);
        }
        else {
            setStatus(status);
            setLimit(true)
        }
    }

    // 圖片 
    function stripHtmlTags(html: string) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    // 熱門、最新文章 card（大）
    function postCard(post: { time: any; account: any; context: any; title: any; Id: any; }) {
        return (
            <Card variant="outlined" sx={{ padding: '1em' }}>
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ marginY: 1 }}>
                        {post.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {post.account}
                    </Typography>
                    <Typography variant="body2">
                        {post.context.length > 150
                            ? `${stripHtmlTags(post.context).substring(0, 150)}……`
                            : stripHtmlTags(post.context)
                        }
                    </Typography>
                </CardContent>
                <Divider light sx={{ margin: '1em' }} />
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <CalendarMonth sx={{ fontSize: '1rem', marginRight: '0.2em' }} />
                        {post.time.toDate().toLocaleString()}
                    </Typography>
                    <Button variant="outlined" onClick={() => detailContex(post.Id)} startIcon={<AdsClick />} size="large">
                        查看內容
                    </Button>
                </CardActions>
            </Card>
        )
    }

    // 查看所有最新文章、所有熱門文章
    function smallPostCard(post: { time: any; account: any; context: any; title: any; Id: any; }) {
        return (
            <Card variant="outlined" sx={{ padding: '1em' }}>
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ marginY: 1 }}>
                        {post.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {post.account}
                    </Typography>
                    <Typography variant="body2">
                        {post.context.length > 150
                            ? `${stripHtmlTags(post.context).substring(0, 150)}……`
                            : stripHtmlTags(post.context)
                        }
                    </Typography>
                </CardContent>
                <Divider light sx={{ margin: '0.5em' }} />
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <CalendarMonth sx={{ fontSize: '1rem', marginRight: '0.2em' }} />
                        {post.time.toDate().toLocaleString()}
                    </Typography>
                    <Button variant="outlined" onClick={() => detailContex(post.Id)} startIcon={<AdsClick />} size="large">
                        查看內容
                    </Button>
                </CardActions>
            </Card>
        )
    }

    // 換頁
    const [page, setPage] = useState(1);
    const postsPerPage = 9;

    function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
        setPage(value);
    };

    // 算頁數
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentHot = hot.slice(indexOfFirstPost, indexOfLastPost);
    const currentTime = time.slice(indexOfFirstPost, indexOfLastPost);



    return (
        <div style={{ margin: '6em' }}>
            {status === "總攬" && (
                <div>
                    {/*熱門文章*/}
                    <Typography variant="h2" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <Whatshot sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred' }} />
                        ReactGOGO 熱門文章
                    </Typography>
                    {/* 熱門文章-左半部顯示標題與按鈕、右半部顯示熱門文章 */}
                    <Grid container>
                        {/*熱門文章-介紹文字與查看所有熱門文章按鈕*/}
                        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ marginY: '1.5em', display: 'flex', alignItems: 'center' }}>
                                最熱絡的討論<br /><br />　　就在 ReactGOGO
                            </Typography>
                            <img src="../K-pop band-rafiki.png" alt="welcome" width='100%' />
                            <Button sx={{ width: '85%', height: '30%', borderRadius: '1.5em', backgroundColor: 'IndianRed' }} variant="contained" onClick={() => changeStatus("熱門")}>
                                <Typography variant="h4">
                                    <TouchApp sx={{ fontSize: '3rem', marginRight: '0.2em', color: 'white' }} />查看所有熱門文章
                                </Typography>
                            </Button>
                        </Grid>
                        {/*熱門文章-前三名*/}
                        <Grid item flexDirection="column" xs={8}>
                            {hot.map((post) => (postCard(post)))}
                        </Grid>
                    </Grid>

                    {/*分隔線*/}
                    <Divider light sx={{ marginY: '4em' }} />

                    {/*最新文章*/}
                    <Typography variant="h2" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <AutoAwesome sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'Orange' }} />最新文章
                    </Typography>

                    {/* 最新文章-左半部顯示標題與按鈕、右半部顯示熱門文章 */}
                    <Grid container>
                        {/*最新文章-介紹文字與查看更多最新文章按鈕*/}
                        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ marginY: '1.5em', display: 'flex', alignItems: 'center' }}>
                                ReactGOGO！<br /><br />　　新消息 GOGO！
                            </Typography>
                            <img src="../Pleasant surprise-cuate.png" alt="welcome" width='100%' />
                            <Button sx={{ width: '85%', height: '30%', borderRadius: '1.5em', backgroundColor: 'Orange' }} variant="contained" onClick={() => changeStatus("本月")}>
                                <Typography variant="h4">
                                    <TouchApp sx={{ fontSize: '3rem', marginRight: '0.2em', color: 'white' }} />查看更多最新文章
                                </Typography>
                            </Button>
                        </Grid>
                        {/*最新文章-最新的三篇文章*/}
                        <Grid item flexDirection="column" xs={8}>
                            {time.map((post) => (postCard(post)))}
                        </Grid>
                    </Grid>
                </div>
            )}

            {status === "熱門" && (
                <Grid sx={{ padding: '4em' }}>
                    <Typography variant="h4" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <Whatshot sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred' }} />
                        所有熱門文章
                    </Typography>
                    <Divider light />
                    <Grid container spacing={2}>
                        {currentHot.map((post) => (smallPostCard(post)))}
                    </Grid>
                    <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總覽</Button>
                    <Stack spacing={2} mt={3}>
                        <Pagination
                            count={Math.ceil(hot.length / postsPerPage)}
                            page={page}
                            variant="outlined"
                            color="primary"
                            onChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            )}

            {status === "本月" && (
                <Grid sx={{ padding: '4em' }}>
                    <Grid container spacing={2} sx={{ padding: 4 }}>
                        {currentTime.map((post) => (smallPostCard(post)))}
                    </Grid>
                    <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總覽</Button>
                    <Stack spacing={2} mt={3}>
                        <Pagination
                            count={Math.ceil(time.length / postsPerPage)}
                            page={page}
                            variant="outlined"
                            color="primary"
                            onChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            )}



            {status === "詳細" && Id && (
                <div>
                    {context.map((item) => (
                        <Card variant="outlined" sx={{ padding: '1em' }} key={Id}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ marginY: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {item.account}
                                </Typography>
                                <Typography variant="body2">
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
                                        'link', 'image'
                                    ]}
                                    readOnly={true}
                                />
                                {Array.isArray(item.tag) ? (
                                    item.tag.map((tagItem, index) => (
                                        <Typography key={index}>
                                            {tagItem}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography>
                                        無
                                    </Typography>
                                )}
                                {item.tag}
                                {item.photo && (
                                    <Image src={item.photo} alt="image" priority={true} height={300} width={300} />
                                )}
                                <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總覽</Button>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            )}
        </div>
    );
}
