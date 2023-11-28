'use client'
import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from '../account/authContext';




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
                            margin: '4px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '4px',
                        }}
                    >
                        <div>{tag}</div>
                        <IconButton onClick={() => handleRemoveTag(index)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="新增標籤"
                    variant="outlined"
                    name="tag"  // Add this line to set the name attribute
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <IconButton onClick={handleAddTagButtonClick}>
                    <AddIcon />
                </IconButton>
            </div>
        </div>
    );
};

const App = () => {
    const handleTagRemove = (index: number) => {
        console.log(`Removing tag at index ${index}`);
        // Add your custom logic for tag removal here
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


    const [newPost, setNewPost] = useState<Post>({ id: "", account: authContext, context: "", datetime: new Date(), tag: [], title: "" });



    const [status, setStatus] = useState({ visible: false });



    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedPost, setEditedPost] = useState({ account: "", context: "", datetime: new Date(), tag: [], title: "" });
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



    // const update = () => {
    //     // setPosts([...posts, newPost]);
    //     setNewPost({ ...newPost, visible: false, account: "", context: "", datetime: new Date(), tag: "", title: "" });
    //     console.log(posts);
    // };


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
        setNewPost({ id: "", account: authContext, context: "", datetime: new Date(), tag: [], title: "" });
        console.log("success reset")
    }


    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setEditPostIndex(-1);
        setEditedPost({ account: "", context: "", datetime: new Date(), tag: [], title: "" });
    };



    return (
        <div>
            <Grid container spacing={2}>

                {posts.map((post, index) => (
                    post.account === authContext && (
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
                    )
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
                    <TextField label="帳號" variant="outlined" name="account" value={authContext} onChange={handleClick} fullWidth InputProps={{
                        readOnly: true,
                        style: { backgroundColor: '#f2f2f2' },
                    }} /><br />
                    <TextField label="標題" variant="outlined" name="title" value={newPost.title} onChange={handleClick} fullWidth /><br />
                    {/* <TextField label="標籤" variant="outlined" name="tag" value={newPost.tag} onChange={handleClick} fullWidth /><br /> */}
                    <TagInput
                        onUpdate={(updatedTags) => setNewPost({ ...newPost, tag: updatedTags })}
                        initialTags={newPost.tag}
                        onRemove={function (index: number): void { }}
                    />


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
    );
}


