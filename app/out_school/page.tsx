'use client'
import React, { useState, useContext } from "react";
import { inOutPosts } from "../in_school/all_school_data";
import Image from 'next/image'
import useDetails from '../detail_data';
import { Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack } from "@mui/material";
// 圖片
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import heart
import Heart from "react-heart"
import { getFirestore, collection, getDocs, query, where, getDoc, doc, addDoc, updateDoc, deleteDoc} from 'firebase/firestore';

// import account
import { AuthContext } from '../account/authContext';

function OutSchool() {
    // 取得現在的帳號
    const authContext = useContext(AuthContext);
    const email = authContext.email

    // 篩選校外  
    const [posts, setPosts] = inOutPosts("大學");

    // 詳細內容
    const [status, setStatus] = useState("校外");
    const [Id, setId] = useState("");
    const [context, setContext] = useDetails(Id);

    const detailContex = (id:string) => {
        setStatus("詳細");
        setId(id);
      }
    
    const goBack =() => {
        setStatus("校外");
      }
    
    // 換頁
    const [page, setPage] = useState(1);
    const postsPerPage = 9;
  
    const handleChangePage = (event: React.ChangeEvent<unknown>, value:number) => {
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

    // 收藏
    const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

    const handleHeartClick = async (postId: string) => {
        const isCurrentlyActive = !activeMap[postId];
        console.log("heart:", isCurrentlyActive)

        // getFirestore
        const db = getFirestore();

        // check like status
        const likesCollection = collection(db, 'likes');
        const likeQuery = query(likesCollection, where('postId', '==', postId));
        const likeSnapshot = await getDocs(likeQuery);

        const confirmed = likeSnapshot.empty
        ? window.confirm('確定收藏文章？')
        : window.confirm('確定取消收藏？');

        if (confirmed) {
          if (likeSnapshot.empty) {
            // User is liking the post
            try {
              // Add a new like to the 'likes' collection
              await addDoc(likesCollection, { email, postId });
      
              // Increment the 'like' value in the 'posts' collection
              const postsCollection = collection(db, 'post');
              const postRef = doc(postsCollection, postId);
              const postDoc = await getDoc(postRef);
      
              if (postDoc.exists()) {
                const postData = postDoc.data();
                const currentLikes = postData?.like || 0;
      
                await updateDoc(postRef, { like: currentLikes + 1 });
              }
      
              // Update posts after modifying the 'like' value
              await OutSchool();
            } catch (error) {
              console.error('Error adding post to likes:', error);
            }
          } else {
            // Update UI immediately to provide feedback to the user
            const newActiveMap = { ...activeMap, [postId]: isCurrentlyActive };
            setActiveMap(newActiveMap);
            
            if (isCurrentlyActive) {
              // User is unliking the post
              try {
                // Remove the post from the 'likes' collection
                likeSnapshot.forEach(async (likeDoc) => {
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
              
                // Update posts after modifying the 'like' value
                await OutSchool();
              } catch (error) {
                console.error('Error removing post from likes:', error);
              }
            }
          
          }
        }
    };

    return (
        <div>
        {status === "校外" && (
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
                            <CardActions style={{ justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => detailContex(post.Id)}>查看內容</Button>
                                <div style={{ width: "1.5rem", marginRight: '0.5rem', marginLeft: '1.5rem'}}>
                                  <Heart
                                    isActive={activeMap[post.Id]}
                                    onClick={() => handleHeartClick(post.Id)}
                                    activeColor="red"
                                    inactiveColor="black"
                                    animationTrigger="hover"
                                    animationScale={1.5}
                                  />
                                </div>
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
                    <div>{item.tag}</div>
                    {item.photo && (
                        <Image src={item.photo} alt="image" priority={true} height={300} width={300} />
                    )}
                </div>
                ))}
                <Button variant="outlined" onClick={goBack}>返回校內總攬</Button>
            </div>
        )}
        </div>
    );
}

export default OutSchool;

