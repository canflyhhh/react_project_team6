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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import usePosts from "./usePosts"; // Import the custom hook for posts
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';



export default function PostList() {

  // const [posts, setPosts] = usePosts(); // Use the custom hook to fetch posts
  const [posts, setPosts, addPost] = usePosts();

  function add() {
    addPost?.(newPost);
    setNewPost({ ...newPost, visible: false })
    console.log(posts);
  }


  const [newPost, setNewPost] = useState({ visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedPost, setEditedPost] = useState({ account: "", context: "", datetime: new Date(), tag: "", title: "" });
  const [editPostIndex, setEditPostIndex] = useState(-1);

  const handleClick = function (e: { target: { name: any; value: any; }; }) {
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

  const show = () => {
    setNewPost({ ...newPost, visible: true });
  };

  const update = () => {
    setPosts([...posts, newPost]);
    setNewPost({ visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
    console.log(posts);
  };

  const hide = () => {
    setNewPost({ visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
  };

  // const deletePost = (post_index) => {
  //   const updatedPosts = [...posts];
  //   updatedPosts.splice(post_index, 1);
  //   setPosts(updatedPosts);
  // };

  // const openEditDialog = (post_index) => {
  //   setEditDialogOpen(true);
  //   setEditPostIndex(post_index);
  //   setEditedPost(posts[post_index]);
  // };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditPostIndex(-1);
    setEditedPost({ account: "", context: "", datetime: new Date(), tag: "", title: "" });
  };

  // const saveEditedPost = () => {
  //   if (editPostIndex !== -1) {
  //     const updatedPosts = [...posts];
  //     updatedPosts[editPostIndex] = editedPost;
  //     setPosts(updatedPosts);
  //     closeEditDialog();
  //   }
  // };

  return (
    <Box
      sx={{
        width: "80vw",
        height: "100vh",
        backgroundColor: "background.paper",
        color: "black",
        textAlign: "left",
      }}
    >
      <Dialog open={newPost.visible} onClose={hide} aria-labelledby="新增帖子">
        <DialogTitle>新增帖子</DialogTitle>
        <DialogContent>
          <TextField label="帳號" variant="outlined" name="account" value={newPost.account} onChange={handleClick} /><br />
          <TextField label="內容" variant="outlined" name="context" value={newPost.context} onChange={handleClick} /><br />
          {/* <DatePicker label="日期時間" variant="outlined" name="datetime" value={newPost.datetime} onChange={handleClick}></DatePicker> */}
          {/* <TextField label="日期時間" variant="outlined" name="datetime" value={newPost.datetime} onChange={handleClick} /><br /> */}
          <TextField label="標籤" variant="outlined" name="tag" value={newPost.tag} onChange={handleClick} /><br />
          <TextField label="標題" variant="outlined" name="title" value={newPost.title} onChange={handleClick} /><br />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={hide}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={add}>
            新增
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} aria-labelledby="修改帖子">
        <DialogTitle>修改帖子</DialogTitle>
        <DialogContent>
          <TextField label="帳號" variant="outlined" name="account" value={editedPost.account} onChange={(e) => setEditedPost({ ...editedPost, account: e.target.value })} /><br />
          <TextField label="內容" variant="outlined" name="context" value={editedPost.context} onChange={(e) => setEditedPost({ ...editedPost, context: e.target.value })} /><br />
          {/* <TextField label="日期時間" variant="outlined" name="datetime" value={editedPost.datetime} onChange={(e) => setEditedPost({ ...editedPost, datetime: new Date(e.target.value) })} /><br /> */}
          <TextField label="標籤" variant="outlined" name="tag" value={editedPost.tag} onChange={(e) => setEditedPost({ ...editedPost, tag: e.target.value })} /><br />
          <TextField label="標題" variant="outlined" name="title" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} /><br />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={closeEditDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" >
            儲存
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <button onClick={show}>新增帖子</button>
        <List subheader="Post list" aria-label="post list">
          {posts.map((post, index) => (
            <ListItem divider key={post.title}>
              <ListItemText primary={post.title} secondary={`Account: ${post.account}, Tag: ${post.tag}, Datetime: ${post.datetime}`} />
              <IconButton edge="end" aria-label="edit" >
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
}
