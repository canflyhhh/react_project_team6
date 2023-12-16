'use client'
import * as React from 'react';
import { usePosts } from "./in_school/all_school_data";
import { useEffect } from 'react';
import { useState } from "react";
import Image from 'next/image'
import useDetails from './detail_data';
import { 
    Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack, Slide, 
    Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent , useMediaQuery, dividerClasses 
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tune } from '@mui/icons-material';


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
    function detailContex(id:string){
      setStatus("詳細");
      setId(id);
    }  
    //從詳細資訊跳至總攬 
    function changeStatus(status:string) {
        if (status === "本月" || status === "熱門") {
            setStatus(status);
            setLimit(false)
        }
        else {
            setStatus(status);
            setLimit(true)
        }
    }  
    //圖片 
    function stripHtmlTags(html: string) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };

    // card
    function postCard(post: { time: any; account: any; context: any; title: any; Id: any; }) {
        return (
            <Grid item xs={4} key={post.Id}>
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
                        <CardActions>
                            <Button variant="outlined" onClick={() => detailContex(post.Id)}>查看內容</Button>
                        </CardActions>
                        <div>{post.time.toDate().toLocaleString()}</div>
                    </Card>
                </Grid>
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
    <div>
    {status === "總攬" && (
        <div>
            {/*前三熱門*/}
            <Grid container spacing={2} sx={{ padding: 4 }}>
            {hot.map((post) => ( postCard(post) ))}
            </Grid>
            <Button variant="outlined" onClick={() => changeStatus("熱門")}>查看更多熱門文章</Button>
            
            <hr />
            {/*前三本月*/}
            <Grid container spacing={2} sx={{ padding: 4 }}>
            {time.map((post) => ( postCard(post) ))}
            </Grid>
            <Button variant="outlined" onClick={() => changeStatus("本月")}>查看更多本月文章</Button>
        </div>
    )}

    {status === "熱門" && (
        <div>
            <Grid container spacing={2} sx={{ padding: 4 }}>
                {currentHot.map((post) => ( postCard(post) ))}
            </Grid>
            <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總攬</Button>
            <Stack spacing={2} mt={3}>
                <Pagination
                    count={Math.ceil(hot.length / postsPerPage)}
                    page={page}
                    variant="outlined"
                    color="primary"
                    onChange={handleChangePage}
                />
            </Stack>
        </div>
    )}

    {status === "本月" && (
        <div>
        <Grid container spacing={2} sx={{ padding: 4 }}>
            {currentTime.map((post) => ( postCard(post) ))}
        </Grid>
        <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總攬</Button>
        <Stack spacing={2} mt={3}>
            <Pagination
                count={Math.ceil(time.length / postsPerPage)}
                page={page}
                variant="outlined"
                color="primary"
                onChange={handleChangePage}
            />
        </Stack>
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
                    {/* <div>{item.context}</div> */}
                    <div>{item.tag}</div>
                    {item.photo && (
                        <Image src={item.photo} alt="image" priority={true} height={300} width={300} />
                    )}
                </div>
            ))}
            <Button variant="outlined" onClick={() => changeStatus("總攬")}>返回總攬</Button>
        </div>
    )}
  </div>
  );
}
