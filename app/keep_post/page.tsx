'use client';
import React, { useState, useEffect, useContext } from 'react';
import { getFirestore, collection, getDocs, query, where, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import {
  Grid, Card, CardContent, Typography, CardActions, Button, Breadcrumbs, Divider, Pagination
} from "@mui/material";
import app from "@/app/_firebase/config"

// import account
import { AuthContext } from '../account/authContext';

// import heart
import Heart from "react-heart"

interface Post {
  id: string;
  title: string;
  account: string;
  datetime: string;
  context: string;
}
import useDetails from '../detail_data';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image'
import { AdsClick, ArrowBack, CalendarMonth, Person, School, Stars } from '@mui/icons-material';
import { useTAG } from '../in_school/all_school_data';

export default function Home() {
  const email = useContext(AuthContext);
  // 詳細內容
  const [status, setStatus] = useState("收藏");
  const [Id, setId] = useState("");
  const [context, setContext, d_like] = useDetails(Id);

  const [TAG, setTAG] = useState("");
  const [TAG_POST, setTAG_POST, tag_like] = useTAG(TAG);
  const detailContex = (id: string) => {
    console.log("ID:", id)
    setStatus("詳細");
    setId(id);
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
  const goBack = () => {
    setStatus("收藏");
  }

  // 將html多元素轉化為純文字
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // 取得現在的帳號
  const authContext = useContext(AuthContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

  const fetchPosts = async () => {

    const email = authContext
    const firestore = getFirestore(app);
    const likesCollection = collection(firestore, 'likes');
    const likesQuery = query(likesCollection, where('email', '==', email));
    const likesSnapshot = await getDocs(likesQuery);

    const postsData: { id: string; title: string; account: string; datetime: string; context: string; }[] = [];

    // Use Promise.all to handle asynchronous calls in parallel
    await Promise.all(
      likesSnapshot.docs.map(async (likeDoc) => {
        const likeData = likeDoc.data();
        const postId = likeData.postId;

        // Query the 'posts' collection for the post with the matching 'id'
        const postsCollection = collection(firestore, 'post');
        const postDoc = await getDoc(doc(postsCollection, postId));

        if (postDoc.exists()) {
          const postData = postDoc.data();
          postsData.push({
            id: postId,
            title: postData.title,
            account: postData.account,
            datetime: postData.datetime,
            context: postData.context,
          })
        }
        // console.log("postsData = ", postsData)
      })
    );
    setPosts(() => [...postsData]);
  };

  // Call fetchPosts when your component mounts or whenever needed
  useEffect(() => {
    fetchPosts();
  }, []);


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

  const clickTAG = (tag: string) => {
    setStatus("TAG");
    setTAG(tag)
  }
  const tag_likecheck = (postId: string, isHeart: boolean) => {
    if (email === '') {
      window.confirm('請先進行登入')
    } else {
      const check = isHeart
        ? window.confirm('確定收藏文章？')
        : window.confirm('確定取消收藏？');
      if (check) {
        tag_like(postId, isHeart)
      }
    }
  }

  const currentTAGPosts = TAG_POST.slice(indexOfFirstPost, indexOfLastPost);



  const handleHeartClick = async (postId: string) => {
    const isCurrentlyActive = !activeMap[postId];

    // Display a confirmation dialog
    const confirmed = window.confirm('確定取消收藏？');

    if (confirmed) {

      // Perform the removal from the 'likes' collection
      if (isCurrentlyActive) {
        // Add code to remove the post from the 'likes' collection
        try {
          const db = getFirestore();
          const likesCollection = collection(db, 'likes');
          const likeQuery = query(likesCollection, where('postId', '==', postId));
          const likeSnapshot = await getDocs(likeQuery);

          likeSnapshot.forEach(async (likeDoc) => {
            console.log("delete success!")
            await deleteDoc(doc(likesCollection, likeDoc.id));

          });

          // Decrement the 'like' value in the 'posts' collection
          const postsCollection = collection(db, 'post');
          const postRef = doc(postsCollection, postId);
          const postDoc = await getDoc(postRef);

          if (postDoc.exists()) {
            const postData = postDoc.data();
            const currentLikes = postData?.like || 0;

            if (currentLikes > 0) {
              await updateDoc(postRef, { like: currentLikes - 1 });
            }
          }

          // 文章即時更新
          await fetchPosts();
        } catch (error) {
          console.error('Error removing post from likes:', error);
        }

      }
    }
  };
  return (
    <div style={{ padding: '6em' }}>
      {status === "收藏" && (
        <div>
          <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
            <Stars sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred' }} />
            我的收藏
          </Typography>
          <Grid container>
            {currentPosts.map((post, index) => (
              <Grid container>
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
                        {post.datetime.toDate().toLocaleString()}
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
                          isActive={!activeMap[post.id]}
                          onClick={() => handleHeartClick(post.id)}
                          activeColor="red"
                          inactiveColor="black"
                          animationTrigger="hover"
                          animationScale={1.5}
                        />
                      </span>
                      
                    </Typography>
                    <Button variant="outlined" onClick={() => detailContex(post.id)} startIcon={<AdsClick />} size="large">
                      查看內容
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
                          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'orange', cursor: 'pointer' }} onClick={() => clickTAG(tagItem)}>
                            {tagItem.trim()}
                          </Typography>
                        </React.Fragment>

                      ))
                    ) : (
                      <Typography sx={{ display: 'flex', alignItems: 'center', color: 'orange', cursor: 'pointer' }} onClick={() => clickTAG(item.tag as string)}>
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
                  返回我的收藏
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
                  {/* Display the like count */}
                  <span style={{ marginLeft: '0.5em' }}>
                    {item.like ? item.like : 0}
                  </span>
                </Typography>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
      {status === "TAG" && (
        <div>
          {/*校內文章*/}
          <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
            <School sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'orange' }} />
            與「{TAG}」相關的文章
          </Typography>
          <Grid container>
            {currentTAGPosts.map((post, index) => (
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
                        onClick={() => tag_likecheck(post.Id, !post.isHeart)}
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
                返回我的收藏
              </Button>
            </Grid>
            <Pagination
              count={Math.ceil(TAG_POST.length / postsPerPage)}
              page={page}
              variant="outlined"
              color="primary"
              onChange={handleChangePage}
              sx={{ marginRight: '16px' }}
            />
          </Grid>
        </div>
      )}
    </div>
  );
}
