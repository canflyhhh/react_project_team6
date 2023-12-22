
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import app from "@/app/_firebase/config"

export default function useDetails(Id:string) {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [posts, setPosts] = useState<{ time: Timestamp, account: string, context:string, title:string, photo:string | null, tag:string[], like:number }[]>([])  

  useEffect(() => {
    async function fetchData() {
      let data: { time: Timestamp, account: string, context:string, title:string, photo:string | null, tag:string[], like:number }[] = [];
      const query1 = collection(db, "post");

      const querySnapshot = await getDocs(query1);
      const promise = querySnapshot.docs.map(async (doc) => {
        if (doc.id == Id) {
          const photoRef = ref(storage, doc.data().photo);
          if (doc.data().photo) {
            try {
              const photoURL = await getDownloadURL(photoRef);
              data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title, photo: photoURL, tag: doc.data().tag, like: doc.data().like });
            } catch (error) {
              console.error("Error fetching photo URL:", error);
            }
          } else {
            data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title, photo: null, tag: doc.data().tag, like: doc.data().like });
          }
        }
      });
      await Promise.all(promise); 
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, Id, storage]);

  useEffect(() => {
  }, [posts]);

  return [posts, setPosts] as const;
}