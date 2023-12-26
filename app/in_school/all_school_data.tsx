
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import app from "@/app/_firebase/config"
import { AuthContext } from '../account/authContext';

export function inOutPosts(status: string) {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[]>([])
  const email = useContext(AuthContext);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // 愛心
      const statusCollection = collection(db, 'likes');
      const statusQuery = query(statusCollection, where('email', '==', email));
      const statusSnapshot = await getDocs(statusQuery);
      const likedPostIds = statusSnapshot.docs.map((statusDoc) => statusDoc.data().postId);

      //資訊
      let data: { time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[] = [];
      const query1 = collection(db, "post");
      const query2 = query(query1, where("location","==", status))
      let querySnapshot;
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        //對比愛心
        const isHeart = likedPostIds.includes(doc.id);
        data.push({ 
          time: doc.data().datetime,
          account: doc.data().account,
          context: doc.data().context,
          title: doc.data().title,
          Id: doc.id,
          like: doc.data().like,
          isHeart: isHeart || false
        })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, status, updated]);

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


  return [posts, setPosts, like] as const;
}

export function useHOT(Limit: boolean) {
  const db = getFirestore(app);
  const [posts, setPosts] = 
  useState<{ 
    time: Timestamp,
    account: string, 
    context:string, 
    title:string, 
    Id:string, 
    like:number,
    isHeart:boolean
   }[]>([])
  const email = useContext(AuthContext);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // 愛心
      const statusCollection = collection(db, 'likes');
      const statusQuery = query(statusCollection, where('email', '==', email));
      const statusSnapshot = await getDocs(statusQuery);
      const likedPostIds = statusSnapshot.docs.map((statusDoc) => statusDoc.data().postId);

      let data: { time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[] = [];
      const query1 = collection(db, "post");
      let query2;
      let querySnapshot;

      if (Limit) {
        query2 = query(query1, orderBy("like", "desc"), limit(3));
      }
      else{
        query2 = query(query1, orderBy("like", "desc"));
      }
      
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        //對比愛心
        const isHeart = likedPostIds.includes(doc.id);
        
        data.push({ 
          time: doc.data().datetime, 
          account: doc.data().account, 
          context: doc.data().context, 
          title: doc.data().title, 
          Id: doc.id, 
          like: doc.data().like,
          isHeart: isHeart || false
        })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, Limit, updated]);

  async function h_like(Id: string, status: boolean) {
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

  return [posts, setPosts, h_like] as const;
}

export function useTIME(Limit: boolean) {
  const db = getFirestore(app);
  const [posts, setPosts] = 
  useState<{ 
    time: Timestamp,
    account: string, 
    context:string, 
    title:string, 
    Id:string, 
    like:number,
    isHeart:boolean
   }[]>([])
  const email = useContext(AuthContext);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // 愛心
      const statusCollection = collection(db, 'likes');
      const statusQuery = query(statusCollection, where('email', '==', email));
      const statusSnapshot = await getDocs(statusQuery);
      const likedPostIds = statusSnapshot.docs.map((statusDoc) => statusDoc.data().postId);

      let data: { time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[] = [];
      const query1 = collection(db, "post");
      let query2;
      let querySnapshot;

      if (Limit) {
        query2 = query(query1, orderBy("datetime", "desc"), limit(3));
      }
      else{
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        query2 = query(query1, orderBy("datetime", "desc"), where("datetime", ">=", startDate));
      }
      
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        //對比愛心
        const isHeart = likedPostIds.includes(doc.id);
        
        data.push({ 
          time: doc.data().datetime, 
          account: doc.data().account, 
          context: doc.data().context, 
          title: doc.data().title, 
          Id: doc.id, 
          like: doc.data().like,
          isHeart: isHeart || false
        })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, Limit, updated]);


  async function t_like(Id: string, status: boolean) {
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

  return [posts, setPosts, t_like] as const;
}

export function useTAG(TAG: string) {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[]>([])
  const email = useContext(AuthContext);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // 愛心
      const statusCollection = collection(db, 'likes');
      const statusQuery = query(statusCollection, where('email', '==', email));
      const statusSnapshot = await getDocs(statusQuery);
      const likedPostIds = statusSnapshot.docs.map((statusDoc) => statusDoc.data().postId);

      //資訊
      let data: { time: Timestamp, account: string, context:string, title:string, Id:string, like:number, isHeart:boolean }[] = [];
      const query1 = collection(db, "post");
      const query2 = query(query1, where("tag","array-contains", TAG))
      let querySnapshot;
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        //對比愛心
        const isHeart = likedPostIds.includes(doc.id);
        data.push({ 
          time: doc.data().datetime,
          account: doc.data().account,
          context: doc.data().context,
          title: doc.data().title,
          Id: doc.id,
          like: doc.data().like,
          isHeart: isHeart || false
        })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, TAG, updated]);

  async function tag_like(Id: string, status: boolean) {
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


  return [posts, setPosts, tag_like] as const;
}

export function usefindTAG() {
  const db = getFirestore(app);
  const [topTags, setTopTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const allTags: string[] = [];

      const querySnapshot = await getDocs(collection(db, "post"));

      querySnapshot.forEach((doc) => {
        const tags = doc.data().tag || [];
        allTags.push(...tags);
      });

      // 统计 tag 出现的次数
      const tagCountMap = new Map<string, number>();
      allTags.forEach((tag) => {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      });

      // 将 Map 转换为数组，并按出现次数降序排序
      const sortedTags = Array.from(tagCountMap.entries()).sort((a, b) => b[1] - a[1]);

      // 获取前 10 个 tag
      const top10Tags = sortedTags.slice(0, 10).map(([tag]) => tag);

      setTopTags(top10Tags);
    }
    fetchData();
  }, [db]);



  return [topTags] as const;
}
