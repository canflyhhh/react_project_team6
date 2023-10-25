import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import app from "@/app/_firebase/Config";
import { useEffect, useState } from "react";

function usePosts() {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<{ account: string, context: string, datetime: Date, tag: string, title: string }[]>([]);

  const [updated, setUpdated] = useState(0);


  async function fetchData() {
    let data: { account: string, context: string, datetime: Date, tag: string, title: string }[] = [];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
      const post = doc.data();
      data.push({
        account: post.account,
        context: post.context,
        datetime: new Date(post.datetime), // Assuming datetime is stored as a valid date string
        tag: post.tag,
        title: post.title,
      });
      console.log(`${doc.id} => ${doc.data()}`);
    });
    setPosts(() => [...data]);
  }

  useEffect(() => {
    async function fetchData() {
      let data: { account: string, context: string, datetime: Date, tag: string, title: string }[] = [];
      const querySnapshot = await getDocs(collection(db, "post"));
      querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
        const post = doc.data();
        data.push({
          account: post.account,
          context: post.context,
          datetime: new Date(post.datetime), // Assuming datetime is stored as a valid date string
          tag: post.tag,
          title: post.title,
        });
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setPosts(() => [...data]);
    }
    fetchData();
  }, [db, updated]);

  async function addPost(post: {account: string, context: string, datetime: Date, tag: string, title: string}) {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "post"),
      { account: post.account, context: post.context, datetime: new Date(), tag: post.tag, title: post.title});
    console.log("Document written with ID: ", docRef.id);

    setUpdated((currentValue) => currentValue + 1)
  }
  return [posts, setPosts, addPost] as const;


  return [posts, setPosts] as const;
}

export default usePosts;
