
import { collection, getDocs, getFirestore, query, orderBy, limit, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "@/app/_firebase/Config"

export default function useProducts() {
  const db = getFirestore(app);
  const [products, setProducts] = useState<{ time: Timestamp, account: string, context:string, title:string }[]>([])
  

  const tag = 'hhh'

  useEffect(() => {
    async function fetchData() {
      let data: { time: Timestamp, account: string, context:string, title:string }[] = [];
      const query1 = collection(db, "post");
      const query2 = query(query1, where("tag","==", tag));
      const querySnapshot = await getDocs(query2);
      querySnapshot.forEach((doc) => {
        data.push({ time: doc.data().datetime, account: doc.data().account, context: doc.data().context, title: doc.data().title })
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setProducts(() => [...data]);
    }
    fetchData();
  }, [db]);
  return [products, setProducts] as const;
}