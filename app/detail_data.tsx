
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import app from "@/app/_firebase/config"
import { AuthContext } from './account/authContext';

export default function useDetails(Id:string) {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, tag:string[] | string, like:number, isHeart:boolean, Id:string }[]>([])  
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
      let data: { time: Timestamp, account: string, context:string, title:string, tag:string[] | string, like:number, isHeart:boolean, Id:string }[] = [];
      const query1 = collection(db, "post");

      const querySnapshot = await getDocs(query1);
      const promise = querySnapshot.docs.map(async (doc) => {
        if (doc.id == Id) {
          //對比愛心
          const isHeart = likedPostIds.includes(doc.id);
          
          data.push({ 
            time: doc.data().datetime, 
            account: doc.data().account, 
            context: doc.data().context, 
            title: doc.data().title, 
            tag: doc.data().tag, 
            like: doc.data().like,
            isHeart: isHeart || false,
            Id: doc.id
        });
        }
      });
      await Promise.all(promise); 
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, Id, updated]);

  useEffect(() => {
  }, [posts]);
  
  async function d_like(Id: string, status: boolean) {
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

  return [posts, setPosts, d_like] as const;
}