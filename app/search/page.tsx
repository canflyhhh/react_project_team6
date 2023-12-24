"use client"

import React, { useState, useEffect, useContext } from 'react';
import app from "@/app/_firebase/config";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';
//import { searchPosts } from "../in_school/all_school_data";
import { AuthContext } from '../account/authContext';

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
import { CalendarMonth, Interests } from '@mui/icons-material';
import { Divider } from '@mui/material';
import Heart from "react-heart"


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
  time: Timestamp, 
  account: string, 
  context:string, 
  title:string, 
  Id:string, 
  like:number, 
  isHeart:boolean 
  // Other fields in your post
}

interface SearchComponentProps {
  // Add any other props you might need
}



const SearchComponent: React.FC<SearchComponentProps> = () => {
  //const [posts, setSearchPosts, like] = searchPosts();
  const [searchType, setSearchType] = useState('title'); // 預設以標題搜尋
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchPosts, setSearchPosts] = useState<Post[]>([]);
  const email = useContext(AuthContext);
  const [updated, setUpdated] = useState(0);

  async function like(Id: string, status: boolean) {
    const db = getFirestore(app);    
    const postsCollection = collection(db, 'post');
    const postRef = doc(postsCollection, Id);
    const postDoc = await getDoc(postRef);

    const likesCollection = collection(db, 'likes');
    const likeQuery = query(likesCollection, where('postId', '==', Id));
    const likeSnapshot = await getDocs(likeQuery);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const currentLikes = postData?.like || 0;
      if (status) {
        try {
          // 新增收藏文章
          await addDoc(collection(db, 'likes'), { email: email, postId: Id });
          
          //文章收藏數+1
          await updateDoc(postRef, { like: currentLikes + 1 });
        } catch (error) {
          console.error('Error adding post to likes:', error);
        } 
      }
      else {
        try {
          // 刪除收藏
          likeSnapshot.forEach(async (likeDoc) => {
            await deleteDoc(doc(likesCollection, likeDoc.id));
          });

          //文章收藏數-1
          if (currentLikes > 0) {
            await updateDoc(postRef, { like: currentLikes - 1 });
          }
        } catch (error) {
          console.error('Error removing post from likes:', error);
        }
        
      }
    }
    setUpdated((currentValue) => currentValue + 1)
  }

  // 將html多元素轉化為純文字
  const stripHtmlTags = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
  };


  // 卡片收藏
  const likecheck = (postId: string, isHeart: boolean) => {
    const check = isHeart
        ? window.confirm('確定收藏文章？')
        : window.confirm('確定取消收藏？');
    if (check) {
        like(postId, isHeart)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const firestore = getFirestore(app);
      // 愛心
      const statusCollection = collection(firestore, 'likes');
      const statusQuery = query(statusCollection, where('email', '==', email));
      const statusSnapshot = await getDocs(statusQuery);
      const likedPostIds = statusSnapshot.docs.map((statusDoc) => statusDoc.data().postId);

      const postsCollection = collection(firestore, 'post');

      // 選擇以標題&內文或作者搜尋
      if (searchType == 'title') {
        const querySnapshot = await getDocs(postsCollection);
        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
            // 如果標題或內文包含 searchTerm，將其加入搜尋結果
            if (doc.data().title.includes(searchTerm) || doc.data().context.includes(searchTerm) || doc.data().account.includes(searchTerm)) {
              //對比愛心
              const isHeart = likedPostIds.includes(doc.id);
              const postData = { 
                time: doc.data().datetime,
                account: doc.data().account,
                context: doc.data().context,
                title: doc.data().title, 
                Id: doc.id,
                like: doc.data().like,
                isHeart: isHeart || false
              };
              postsData.push(postData);
            }
        });
        setSearchPosts(postsData);
      } else {
        const q = query(postsCollection, where('account', '>=', searchTerm), where('account', '<=', searchTerm + '\uf8ff'));
      
        const querySnapshot = await getDocs(q);

        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
          //對比愛心
          const isHeart = likedPostIds.includes(doc.id);
          const postData = { 
            time: doc.data().datetime,
            account: doc.data().account,
            context: doc.data().context,
            title: doc.data().title, 
            Id: doc.id,
            like: doc.data().like,
            isHeart: isHeart || false
          };
          postsData.push(postData);
        });
        setSearchPosts(postsData);
      }

    
      
    };
    if (searchTerm) {
      fetchPosts();
    } else {
      setSearchPosts([]);
    }
  }, [searchTerm,updated]);

  return (
    <div style={{ padding: '6em' }}>
      <Typography variant="h3" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold', marginBottom: '1em' }}>
        <Interests sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'orange' }} />
        快來使用ReactGOGO的強大搜尋
      </Typography>
      <div>
        {/* 搜尋方式 */}
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">標題&內文</option>
          <option value="author">作者</option>
        </select>
        {/* 搜尋框 */}
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

        {/* 搜尋文章 */}
        {searchTerm.length !== 0 && (
          <div>
            {searchPosts.length > 0 ? (
              <Grid container>
                {searchPosts.map((post, index) => (
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
                                        onClick={() => likecheck(post.Id, !post.isHeart)}
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
                            <Button variant="outlined" size="large">
                                查看內容
                            </Button>
                        </CardActions>
                    </Card>
                ))}
              </Grid>
            ) : (
              <p>無符合結果</p>
            )}
          </div>
        )}

        {/* 詳細內容 */}
      </div>
    </div>
    
  );
};

export default SearchComponent;
