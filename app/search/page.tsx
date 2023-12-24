"use client"

import React, { useState, useEffect } from 'react';
import app from "@/app/_firebase/config";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import usePosts from '../post/usePosts';

// import card
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// import search
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
padding: theme.spacing(0, 2),
height: '100%',
position: 'absolute',
pointerEvents: 'none',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

//
interface Post {
  id: string;
  title: string;
  account: string;
  context: string;
  like: number;
  // Other fields in your post
}

interface SearchComponentProps {
  // Add any other props you might need
}

const SearchComponent: React.FC<SearchComponentProps> = () => {
  const [searchType, setSearchType] = useState('title'); // 預設以標題搜尋
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchPosts, setSearchPosts] = useState<Post[]>([]);


  useEffect(() => {
    const fetchPosts = async () => {
      const firestore = getFirestore(app);
      const postsCollection = collection(firestore, 'post');

      // 選擇以標題或作者搜尋
      if (searchType == 'title') {
        const q = query(postsCollection, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
      
        const querySnapshot = await getDocs(q);

        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as Post);
        });
        setSearchPosts(postsData);
      } else {
        const q = query(postsCollection, where('account', '>=', searchTerm), where('account', '<=', searchTerm + '\uf8ff'));
      
        const querySnapshot = await getDocs(q);

        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as Post);
        });
        setSearchPosts(postsData);
      }
      
    };

    if (searchTerm) {
      fetchPosts();
    } else {
      setSearchPosts([]);
    }
  }, [searchTerm]);

  return (
    <div>
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="title">標題</option>
        <option value="author">作者</option>
      </select>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          type="text"
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>

      {searchTerm.length !== 0 && (
        <div>
          {searchPosts.length > 0 ? (
            <Grid container spacing={2}>
              {searchPosts.map((post) => (
                <Grid item xs={4} key={post.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {post.title}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {post.account}
                      </Typography>
                      <Typography variant="body2">
                        {post.context.length > 50
                          ? `${post.context.substring(0, 50)}……`
                          : post.context}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">查看內容</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <p>無符合結果</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
