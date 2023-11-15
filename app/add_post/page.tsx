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
import { Post } from "../_settings/interfaces";



export default function PostList() {

  const [posts, setPosts, addPost, deletePost, updatePost] = usePosts();

  function addOrUpdate() {
    if (newPost.id === "") {
      console.log("全新體驗");
      addPost(newPost);
    }
    else {
      console.log("更新啦");
      updatePost(newPost)
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
    setStatus({ ...status, visible: true })
  }

  const update = () => {
    // setPosts([...posts, newPost]);
    setNewPost({ ...newPost, visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
    console.log(posts);
  };


  const hide = () => {
    setStatus({ ...status, visible: false })
  }

  function setUpdatePost(post: Post) {
    setNewPost({ ...post })
    setStatus({ visible: true })
  }

  const resetPost = () => {
    setNewPost({ id: newPost.id, account: "", context: "", datetime: new Date(), tag: "", title: "" });
  }


  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditPostIndex(-1);
    setEditedPost({ account: "", context: "", datetime: new Date(), tag: "", title: "" });
  };


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

      <Dialog open={status.visible} onClose={hide} aria-labelledby={newPost.id === "" ? "新增文章" : "更新文章"}>
        <DialogTitle>{newPost.id === "" ? "新增文章" : "更新文章"}</DialogTitle>
        <DialogContent>
          <TextField label="帳號" variant="outlined" name="account" value={newPost.account} onChange={handleClick} /><br />
          <TextField label="內容" variant="outlined" name="context" value={newPost.context} onChange={handleClick} /><br />
          <TextField label="標籤" variant="outlined" name="tag" value={newPost.tag} onChange={handleClick} /><br />
          <TextField label="標題" variant="outlined" name="title" value={newPost.title} onChange={handleClick} /><br />
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
          <Button variant="contained" color="primary" onClick={addOrUpdate}>{newPost.id === "" ? "新增文章" : "更新文章"}</Button>
        </DialogActions>
      </Dialog>

      <div>
        <button onClick={show}>新增帖子</button>
        <List subheader="Post list" aria-label="post list">
          {posts.map((post, index) => (
            <ListItem divider key={post.title}>
              <ListItemText primary={post.title} secondary={`Account: ${post.account}, Tag: ${post.tag}, Datetime: ${post.datetime}`} />
              <IconButton edge="end" aria-label="edit" onClick={() => setUpdatePost(post)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deletePost(post.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
}
