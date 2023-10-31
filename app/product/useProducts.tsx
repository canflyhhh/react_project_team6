import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import app from "@/app/_firebase/config"
import { useEffect, useState } from "react";

function useProducts() {
  const db = getFirestore(app);
  const [products, setProducts] = useState<{ desc: string, price: number }[]>([
    { desc: "iPad", price: 20000 },
    { desc: "iPhone 8", price: 20000 },
    { desc: "iPhone X", price: 30000 }
  ])

  // fecthData();
  useEffect(() => {
    async function fetchData() {
      let data: { desc: string, price: number }[] = [];
      const querySnapshot = await getDocs(collection(db, "yitzu"));
      querySnapshot.forEach((doc) => {
        data.push({ desc: doc.data().desc, price: doc.data().price })
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setProducts(() => [...data]);
    }
    fetchData();
  }, [db]);

  async function addProduct(product: { desc: string, price: number }) {
    const docRef = await addDoc(collection(db, "product"),
      { desc: product.desc, price: product.price });
    console.log("Document written with ID: ", docRef.id);
  }
  return [products, setProducts, addProduct] as const;

}
export default useProducts;