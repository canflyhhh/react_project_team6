'use client';
import React, { useState, useEffect, useContext} from 'react';
import { getFirestore, collection, getDocs, query, where, getDoc, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import { 
    Grid, Card, CardContent, Typography, CardActions, Button
} from "@mui/material";

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



export default function Home() {

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
    
    const email = authContext.email
    const firestore = getFirestore();
    const likesCollection = collection(firestore, 'likes');
    const likesQuery = query(likesCollection, where('email', '==', email));
    const likesSnapshot = await getDocs(likesQuery);

    const postsData: { id: string; title: string; account: string; datetime: string; context: string;}[] = [];

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
          });
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
    <div>
      {status === "校內" && (
        <Grid container spacing={2} sx={{ padding: 4 }}>
        {posts.map((post, index) => (
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
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={() => detailContex(post.id)}>
                            查看內容
                        </Button>
                        <div style={{ width: "1.5rem", marginRight: '0.5rem', marginLeft: '1.5rem'}}>
                          <Heart
                            isActive={!activeMap[post.id]}
                            onClick={() => handleHeartClick(post.id)}
                            activeColor="red"
                            inactiveColor="black"
                            animationTrigger="hover"
                            animationScale={1.5}
                          />
                        </div>
                    </CardActions>
                </Card>
            </Grid>
        ))}          
      </Grid>
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
            <Button variant="outlined" onClick={goBack}>返回校外總攬</Button>
        </div>
      )}
    </div>
  );
}
