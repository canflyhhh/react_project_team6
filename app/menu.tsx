'use client';
import { AppBar, Button, Toolbar } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import app from "@/app/_firebase/config"

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import { useContext } from 'react';
import { AuthContext } from './account/authContext';

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

const auth = getAuth(app);

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');  

  const unsub = onAuthStateChanged(auth, (user) => {
    setUser(user);
    //console.log(user);
    
    return () => {
      unsub();
    }
  }
  );
  useEffect(unsub, [unsub]);


  // const unsub = onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setEmail(user.email ? user.email : "");
  //   }
  //   else {
  //     setEmail("");
  //   }

  //   //console.log(user);
  //   return () => {
  //     unsub();
  //   }
  // }
  // );
  // useEffect(unsub, [unsub]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          {authContext.email? authContext.email:""}

          <Button color="inherit" variant={pathname === "/" ? "outlined" : "text"} onClick={() => router.push("/")}>主頁面</Button>
          {authContext.email? <Button color="inherit" variant={pathname === "/logout" ? "outlined" : "text"} onClick={() => router.push("/logout")}>登出</Button> 
               : <Button color="inherit" variant={pathname === "/account" ? "outlined" : "text"} onClick={() => router.push("/account")}>註冊 / 登入</Button>
          }
          
          {authContext.email && (
            <>
            <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>產品管理</Button>
            <Button color="inherit" variant={pathname === "/post" ? "outlined" : "text"} onClick={() => router.push("/post")}>我的文章</Button>
            <Button color="inherit" variant={pathname === "/add_post" ? "outlined" : "text"} onClick={() => router.push("/add_post")}>新增文章</Button>
            <Button color="inherit" variant={pathname === "/filter" ? "outlined" : "text"} onClick={() => router.push("/filter")}>filter</Button>
            <Button color="inherit" variant={pathname === "/sort" ? "outlined" : "text"} onClick={() => router.push("/sort")}>排序</Button>
            <Button color="inherit" variant={pathname === "/testmail" ? "outlined" : "text"} onClick={() => router.push("/testmail")}>寄送信箱</Button>
            <Button color="inherit" variant={pathname === "/sort" ? "outlined" : "text"} onClick={() => router.push("/in_school")}>校內</Button>
            <Button color="inherit" variant={pathname === "/sort" ? "outlined" : "text"} onClick={() => router.push("/out_school")}>校外</Button>
          </>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      
    </Box>
  );
}