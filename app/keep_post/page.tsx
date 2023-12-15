'use client';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, getDoc, doc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { 
    Grid, Card, CardContent, Typography, CardActions, Button, Slide, 
    Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent , useMediaQuery,
} from "@mui/material";

// import heart
import app from "@/app/_firebase/config";
import Heart from "react-heart"
import firebase from 'firebase/compat/app';

interface Post {
  id: string;
  title: string;
  account: string;
  datetime: string;
  context: string; // Add this field to store the number of likes
}



export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    // Assuming you have the user ID available
    const userId = 'user4@mail.com'; // Replace this with your actual user ID

    const firestore = getFirestore();
    const likesCollection = collection(firestore, 'likes');
    const likesQuery = query(likesCollection, where('email', '==', userId));
    const likesSnapshot = await getDocs(likesQuery);

    const postsData: { id: string; title: string; account: string; datetime: string; context: string;}[] = [];

    // Use Promise.all to handle asynchronous calls in parallel
    await Promise.all(
      likesSnapshot.docs.map(async (likeDoc) => {
        const likeData = likeDoc.data();
        const postId = likeData.postId;
        console.log("postId = ", postId)

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
        console.log("postsData = ", postsData)
      })
    );
    setPosts(() => [...postsData]);
  };

  // Call fetchPosts when your component mounts or whenever needed
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
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
                        <Button variant="outlined">
                            查看內容
                        </Button>
                    </CardActions>
                </Card>
                {post.id}
            </Grid>
        ))}
    </Grid>
    
  );
}
