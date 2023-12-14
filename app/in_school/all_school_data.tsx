
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "@/app/_firebase/config"

export default function usePosts(tag:string) {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string }[]>([])
  

  useEffect(() => {
    async function fetchData() {
      let data: { time: Timestamp, account: string, context:string, title:string }[] = [];
      const query1 = collection(db, "post");
      const query2 = query(query1, where("tag","array-contains", tag));

      const querySnapshot = await getDocs(query2);
      querySnapshot.forEach((doc) => {
        data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title })
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, tag]);
  return [posts, setPosts] as const;
}