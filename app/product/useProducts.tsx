import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";

function useProducts() {
  const db = getFirestore(app);
  const [products, setProducts] = useState<{ desc: string, price: number }[]>([
    // { desc: "iPad", price: 20000 },
    // { desc: "iPhone 8", price: 20000 },
    // { desc: "iPhone X", price: 30000 }
  ])

  async function fetchData() {
    let data: { desc: string, price: number }[] = [];
    const querySnapshot = await getDocs(collection(db, "guangwei"));
    querySnapshot.forEach((doc) => {
      data.push({ desc: doc.data().desc, price: doc.data().price })
      console.log(`${doc.id} => ${doc.data()}`);
    });
    setProducts(() => [...data]);
  }
  // fecthData();
  useEffect(() => {
    async function fetchData() {
      let data: { desc: string, price: number }[] = [];
      const querySnapshot = await getDocs(collection(db, "guangwei"));
      querySnapshot.forEach((doc) => {
        data.push({ desc: doc.data().desc, price: doc.data().price })
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setProducts(() => [...data]);
    }
    fetchData();
  }, [db]);

  return [products, setProducts] as const;

}

export default useProducts;