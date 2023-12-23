
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import app from "@/app/_firebase/config"
import { AuthContext } from '../account/authContext';

export function inOutPosts(status:string) {
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

export function usePosts(status:string, Limit:boolean) {
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
        query2 = query(query1, orderBy(status, "desc"), limit(3));
        
      }
      else{
        if (status === "datetime") {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          query2 = query(query1, orderBy("datetime", "desc"), where("datetime", ">=", startDate));
        }
        else {
          query2 = query(query1, orderBy("like", "desc"));
        }
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
  }, [db, status, Limit, updated]);

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

  return [posts, setPosts, h_like, t_like] as const;
}

