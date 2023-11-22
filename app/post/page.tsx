// // 'use client'
// // import * as React from 'react';
// // import Box from '@mui/material/Box';
// // import Card from '@mui/material/Card';
// // import CardActions from '@mui/material/CardActions';
// // import CardContent from '@mui/material/CardContent';
// // import Button from '@mui/material/Button';
// // import Typography from '@mui/material/Typography';
// // import { styled } from '@mui/material/styles';
// // import Paper from '@mui/material/Paper';
// // import Grid from '@mui/material/Grid';


// export default function BasicCard() {
//     return (
//         <Grid container spacing={2}>
//             <Grid item xs={4}>
//                 <Card variant="outlined">
//                     <CardContent>
//                         <Typography variant="h5" component="div">
//                             Hello
//                         </Typography>
//                         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                             abc@gmail.com
//                         </Typography>
//                         <Typography variant="body2">
//                             well meaning and kindly.
//                             <br />
//                             {'"a benevolent smile"'}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>
//             </Grid>
//             <Grid item xs={4}>
//                 <Card variant="outlined">
//                     <CardContent>
//                         <Typography variant="h5" component="div">
//                             你好
//                         </Typography>
//                         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                             adjective
//                         </Typography>
//                         <Typography variant="body2">
//                             well meaning and kindly.
//                             <br />
//                             {'"a benevolent smile"'}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>
//             </Grid>
//             <Grid item xs={4}>
//                 <Card variant="outlined">
//                     <CardContent>
//                         <Typography variant="h5" component="div">
//                             Welcome
//                         </Typography>
//                         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                             adjective
//                         </Typography>
//                         <Typography variant="body2">
//                             well meaning and kindly.
//                             <br />
//                             {'"a benevolent smile"'}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>
//             </Grid>
//             <Grid item xs={4}>
//                 <Card variant="outlined">
//                     <CardContent>
//                         <Typography variant="h5" component="div">
//                             asdd
//                         </Typography>
//                         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                             adjective
//                         </Typography>
//                         <Typography variant="body2">
//                             well meaning and kindly.
//                             <br />
//                             {'"a benevolent smile"'}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>
//             </Grid>
//         </Grid>


//     );
// }






'use client'
import React, { useState } from "react";
import {
    Box,
    Input,
    List,
    ListItem,
    ListItemText,
    TextField,
    Dialog,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import usePosts from "./usePosts"; // Import the custom hook for posts
import { Post } from "../_settings/interfaces";
import AddIcon from '@mui/icons-material/Add';




export default function PostList() {

    const [posts, setPosts, addPost, deletePost, updatePost] = usePosts();

    function addOrUpdate() {
        if (newPost.id === "") {
            addPost(newPost);
        }
        else {
            updatePost(newPost);
        }
        setStatus({ ...status, visible: false })
        resetPost();
    }


    const [newPost, setNewPost] = useState<Post>({ id: "", account: "", context: "", datetime: new Date(), tag: "", title: "" });



    const [status, setStatus] = useState({ visible: false });



    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedPost, setEditedPost] = useState({ account: "", context: "", datetime: new Date(), tag: "", title: "" });
    const [editPostIndex, setEditPostIndex] = useState(-1);

    const handleClick = function (e: { target: { name: any; value: any; }; }) {
        console.log("handle click")
        if (e.target.name === 'datetime') {
            setNewPost({
                ...newPost,
                [e.target.name]: new Date(e.target.value), // Keep it as a Date
            });
        } else {
            setNewPost({
                ...newPost,
                [e.target.name]: e.target.value,
            });
        }
    };



    const update = () => {
        // setPosts([...posts, newPost]);
        setNewPost({ ...newPost, visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
        console.log(posts);
    };


    const hide = () => {
        setStatus({ ...status, visible: false })
        resetPost()
    }
    const show = () => {
        setStatus({ ...status, visible: true })
    }

    function setUpdatePost(post: Post) {
        setNewPost({ ...post })
        setStatus({ visible: true })
    }

    const resetPost = () => {
        setNewPost({ id: "", account: "", context: "", datetime: new Date(), tag: "", title: "" });
        console.log("success reset")
    }


    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setEditPostIndex(-1);
        setEditedPost({ account: "", context: "", datetime: new Date(), tag: "", title: "" });
    };


    return (
        <div>
            <Grid container spacing={2}>
                {posts.map((post, index) => (
                    <Grid item xs={4} key={post.id}>
                        <Card variant="outlined" style={{ position: 'relative' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" component="div">
                                        {post.title}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton aria-label="edit" onClick={() => setUpdatePost(post)} sx={{ marginRight: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => deletePost(post.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {post.account}
                                </Typography>
                                {post.context.length > 50
                                    ? (
                                        <Typography variant="body2">
                                            {`${post.context.substring(0, 50)}……`}
                                        </Typography>
                                    )
                                    : (
                                        <Typography variant="body2">
                                            {`${post.context}`}
                                        </Typography>
                                    )
                                }

                            </CardContent>
                            <CardActions style={{ position: 'relative', bottom: 0, right: 0 }}>
                                <Button size="small">Learn More</Button>

                                <Typography>{post.datetime.toLocaleString()}</Typography>
                            </CardActions>
                        </Card>
                    </Grid>

                ))}

            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                style={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={show} // Assuming you want to show a dialog or something on click
            >
                <AddIcon />
            </Fab>

            <Dialog
                open={status.visible}
                onClose={hide}
                aria-labelledby={newPost.id === "" ? "新增文章" : "更新文章"}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        width: '80%', // Adjust the width as needed
                        maxHeight: '80%', // Adjust the maxHeight as needed
                    },
                }}
            >
                <DialogTitle>{newPost.id === "" ? "新增文章" : "更新文章"}</DialogTitle>
                <DialogContent>
                    <TextField label="帳號" variant="outlined" name="account" value={newPost.account} onChange={handleClick} fullWidth /><br />
                    <TextField label="標題" variant="outlined" name="title" value={newPost.title} onChange={handleClick} fullWidth /><br />
                    <TextField label="標籤" variant="outlined" name="tag" value={newPost.tag} onChange={handleClick} fullWidth /><br />
                    <TextField label="內容" variant="outlined" name="context" value={newPost.context} onChange={handleClick} multiline rows={8} fullWidth /><br />
                </DialogContent>
                <DialogActions>
                    <IconButton
                        aria-label="close"
                        onClick={hide}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={addOrUpdate}>
                        {newPost.id === "" ? "新增文章" : "更新文章"}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>



        // <Box
        //   sx={{
        //     width: "80vw",
        //     height: "100vh",
        //     backgroundColor: "background.paper",
        //     color: "black",
        //     textAlign: "left",
        //   }}
        // >

        //   <Dialog open={status.visible} onClose={hide} aria-labelledby={newPost.id === "" ? "新增文章" : "更新文章"}>
        //     <DialogTitle>{newPost.id === "" ? "新增文章" : "更新文章"}</DialogTitle>
        //     <DialogContent>
        //       <TextField label="帳號" variant="outlined" name="account" value={newPost.account} onChange={handleClick} /><br />
        //       <TextField label="內容" variant="outlined" name="context" value={newPost.context} onChange={handleClick} /><br />
        //       <TextField label="標籤" variant="outlined" name="tag" value={newPost.tag} onChange={handleClick} /><br />
        //       <TextField label="標題" variant="outlined" name="title" value={newPost.title} onChange={handleClick} /><br />
        //     </DialogContent>
        //     <DialogActions>
        //       <IconButton
        //         aria-label="close"
        //         onClick={hide}
        //         sx={{
        //           position: 'absolute',
        //           right: 8,
        //           top: 8,
        //         }}
        //       >
        //         <CloseIcon />
        //       </IconButton>
        //       <Button variant="contained" color="primary" onClick={addOrUpdate}>{newPost.id === "" ? "新增文章" : "更新文章"}</Button>
        //     </DialogActions>
        //   </Dialog>

        //   <div>
        //     <button onClick={show}>新增帖子</button>
        //     <List subheader="Post list" aria-label="post list">
        //       {posts.map((post, index) => (
        //         <ListItem divider key={post.title}>
        //           <ListItemText primary={post.title} secondary={`Account: ${post.account}, Tag: ${post.tag}, Datetime: ${post.datetime}`} />
        //           <IconButton edge="end" aria-label="edit" onClick={() => setUpdatePost(post)}>
        //             <EditIcon />
        //           </IconButton>
        //           <IconButton edge="end" aria-label="delete" onClick={() => deletePost(post.id)}>
        //             <DeleteIcon />
        //           </IconButton>
        //         </ListItem>
        //       ))}
        //     </List>
        //   </div>
        // </Box>
    );
}


