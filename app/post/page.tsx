'use client'
import React, { useContext, useEffect, useState } from "react";
import {
    Box, TextField, Dialog, Button, Grid, Card, CardContent, CardActions, Typography, Fab,
    DialogActions, DialogContent, DialogTitle, IconButton, Select, MenuItem, Divider, InputLabel
} from "@mui/material";
import { Close, Add, Edit, Delete, AdsClick, Save, Margin, BorderColor } from "@mui/icons-material";
import usePosts from "./usePosts";
import { Post } from "../_settings/interfaces";
import { AuthContext } from '../account/authContext';

import useDetails from '../detail_data';

import { CalendarMonth, PlaylistAddCheckCircle } from '@mui/icons-material';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import '../QuillEditor.css'; // import your custom styles



interface TagInputProps {
    onRemove: (index: number) => void;
    onUpdate?: (updatedTags: string[]) => void;
    initialTags?: string[]; // New prop for initial tags
}

const TagInput: React.FC<TagInputProps> = ({ onRemove, onUpdate, initialTags }) => {
    const [tags, setTags] = useState<string[]>(initialTags || []);
    const [currentTag, setCurrentTag] = useState<string>('');

    useEffect(() => {
        setTags(initialTags || []);
    }, [initialTags]);

    const handleAddTag = () => {
        if (currentTag.trim() !== '') {
            const updatedTags = [...tags, currentTag.trim()];
            setTags(updatedTags);
            setCurrentTag('');

            // Pass the updated tags to the callback
            if (onUpdate) {
                onUpdate(updatedTags);
            }
        }
    };


    const handleRemoveTag = (index: number) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
        onRemove(index);
        if (onUpdate) {
            onUpdate(updatedTags);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents the default behavior of the Enter key (form submission)
            handleAddTag();
        }
    };

    const handleAddTagButtonClick = () => {
        handleAddTag();
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '1em',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            paddingLeft: '1em',
                        }}
                    >
                        <div>{tag}</div>
                        <IconButton onClick={() => handleRemoveTag(index)}>
                            <Close />
                        </IconButton>
                    </div>
                ))}

                <TextField
                    placeholder="加入其他標籤"
                    variant="outlined"
                    name="tag"  // Add this line to set the name attribute
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <IconButton onClick={handleAddTagButtonClick}>
                    <Add sx={{ color: 'indianred' }} />
                </IconButton>
            </div>
        </div>
    );
};

const App = () => {
    const handleTagRemove = (index: number) => {
    };

    return (
        <div>
            <h1>Tag Input Example</h1>
            <TagInput onRemove={handleTagRemove} />
        </div>
    );
};







export default function PostList() {
    const authContext = useContext(AuthContext);

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


    const [newPost, setNewPost] = useState<Post>({ id: "", account: authContext, location: "", context: "", datetime: new Date(), tag: [], title: "" });
    const [status, setStatus] = useState({ visible: false });
    const [file, setFile] = useState<File | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedPost, setEditedPost] = useState({ account: "", context: "", datetime: new Date(), tag: [], title: "" });
    const [editPostIndex, setEditPostIndex] = useState(-1);
    const [value, setValue] = useState('')

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files && e.target.files[0];
        setFile(selectedFile);
    }

    const hide = () => {
        setStatus({ ...status, visible: false })
        resetPost()
    }
    const show = () => {
        resetPost()
        setStatus({ ...status, visible: true })
    }

    function setUpdatePost(post: Post) {
        setNewPost({ ...post })
        setStatus({ visible: true })
    }

    const resetPost = () => {
        setNewPost({ id: "", account: authContext, location: "", context: "", datetime: new Date(), tag: [], title: "" });
    }


    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setEditPostIndex(-1);
        setEditedPost({ account: "", context: "", datetime: new Date(), tag: [], title: "" });
    };



    const handleImageUpload = () => {
        // Handle the image upload logic here
        // You might want to upload the image to your server and then insert the image URL into the editor
    };


    // Function to convert HTML to plain text
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };



    return (
        <div style={{ padding: '6em' }}>
            <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
                <PlaylistAddCheckCircle sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred' }} />
                我的文章
            </Typography>
            <Grid container>
                {posts.map((post, index) => (
                    post.account === authContext && (
                        <Card variant="outlined" sx={{ padding: '1em', marginBottom: '1em', width: '100%' }} key={index}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h4" component="div" sx={{ marginY: 1 }} fontWeight={'bold'}>
                                        {post.title}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton aria-label="edit" onClick={() => setUpdatePost(post)} sx={{ marginRight: 1 }}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => deletePost(post.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5em' }}>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        {post.account}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        <CalendarMonth sx={{ fontSize: '1rem', marginRight: '0.2em' }} />
                                        {post.datetime.toLocaleString()}
                                    </Typography>
                                </div>
                                <Typography variant="body2">
                                    {post.context.length > 150
                                        ? `${stripHtmlTags(post.context).substring(0, 50)}……`
                                        : stripHtmlTags(post.context)
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    )
                )
                )}

            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                style={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={show} // Assuming you want to show a dialog or something on click
            >
                <Add />
            </Fab>

            <Dialog
                open={status.visible}
                onClose={hide}
                aria-labelledby={newPost.id === "" ? "新增文章" : "更新文章"}
                PaperProps={{
                    style: {
                        maxWidth: '100%',
                        maxHeight: '90%',
                        width: '100%',
                        height: '100%',
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', marginY: '1em' }} variant={'h4'}>
                    <Edit sx={{ marginRight: '0.5em' }} />{newPost.id === "" ? "新增文章" : "修改我的文章"}
                </DialogTitle>
                <DialogContent>
                    <div style={{ marginBottom: '1em' }}>
                        <InputLabel htmlFor="title">標題</InputLabel>
                        <TextField
                            variant="outlined"
                            name="title"
                            value={newPost.title}
                            onChange={handleClick}
                            fullWidth
                        />
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <InputLabel htmlFor="select">文章種類</InputLabel>
                        <Select
                            label="選擇"
                            variant="outlined"
                            value={newPost.location}
                            onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value="校內">校內</MenuItem>
                            <MenuItem value="校外">校外</MenuItem>
                        </Select>
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <InputLabel htmlFor="tagInput">文章標籤</InputLabel>
                        <TagInput
                            onUpdate={(updatedTags) => setNewPost({ ...newPost, tag: updatedTags })}
                            initialTags={newPost.tag}
                            onRemove={() => { }}
                        />
                    </div>

                    {/* 文章內容 */}
                    <div style={{ marginBottom: '1em' }}>
                        <ReactQuill
                            theme="snow"
                            value={newPost.context}
                            onChange={(content) => setNewPost({ ...newPost, context: content })}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, false] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link', 'image'],
                                    ['clean']
                                ],
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image'
                            ]}
                        />
                    </div>
                    {file &&
                        <div
                            style={{
                                width: '100%',
                                border: '1px solid orange',
                                backgroundColor: 'white',
                                padding: '8px', // Adding padding for better visibility
                                boxSizing: 'border-box', // Include padding in width calculation
                                cursor: 'pointer',
                                borderRadius: '5px', // Adding border radius,
                                marginBottom: '1em'
                            }}>
                            <img src={URL.createObjectURL(file)} alt="Selected" style={{ marginTop: '10px', maxWidth: '100%' }} />
                        </div>
                    }
                    <input type="file" onChange={handleChange} width={'100%'}
                        style={{
                            width: '100%',
                            border: '1px solid orange',
                            backgroundColor: 'white',
                            padding: '8px', // Adding padding for better visibility
                            boxSizing: 'border-box', // Include padding in width calculation
                            cursor: 'pointer',
                            borderRadius: '5px', // Adding border radius
                        }}
                    />


                </DialogContent>
                <DialogActions sx={{ paddingX: '1.5em', paddingY: '1em' }}>
                    <IconButton
                        aria-label="close"
                        onClick={hide}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={addOrUpdate} size="large" startIcon={<Save />}>
                        {newPost.id === "" ? "確認新增" : "儲存更新"}
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}


