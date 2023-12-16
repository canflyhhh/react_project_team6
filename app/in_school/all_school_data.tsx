
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "@/app/_firebase/config"

export function inOutPosts(status:string) {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, Id:string }[]>([])
  

  useEffect(() => {
    async function fetchData() {
      let data: { time: Timestamp, account: string, context:string, title:string, Id:string }[] = [];
      const query1 = collection(db, "post");
      const query2 = query(query1, where("tag","array-contains", status))
      let querySnapshot;
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title, Id: doc.id })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, status]);
  return [posts, setPosts] as const;
}

export function usePosts(status:string, Limit:boolean) {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, Id:string }[]>([])

  useEffect(() => {
    async function fetchData() {
      let data: { time: Timestamp, account: string, context:string, title:string, Id:string }[] = [];
      const query1 = collection(db, "post");
      let query2;
      let querySnapshot;

      if (Limit) {
        query2 = query(query1, orderBy(status, "desc"), limit(3));
        
      }
      else{
        query2 = query(query1, orderBy(status, "desc"));
      }
      
      if (query2) {
        querySnapshot = await getDocs(query2);
      }
      else {
        querySnapshot = await getDocs(query1);
      }
      
      querySnapshot.forEach((doc) => {
        data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title, Id: doc.id })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, status, Limit]);
  return [posts, setPosts] as const;
}