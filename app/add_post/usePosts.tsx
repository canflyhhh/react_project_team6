import { addDoc, collection, getDocs, getFirestore, deleteDoc, doc, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useEffect, useState } from "react";
import { Post } from "../_settings/interfaces";



function usePosts() {
  const db = getFirestore(app);
  // const [posts, setPosts] = useState<{ account: string, context: string, datetime: Date, tag: string, title: string }[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [updated, setUpdated] = useState(0);


  async function fetchData() {
    let data: Post[] = [];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
      const post = doc.data();
      data.push({
        id: post.id,
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
      let data: Post[] = [];
      const querySnapshot = await getDocs(collection(db, "post"));
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        data.push({
          id: doc.id,
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

  async function addPost(post: { account: string, context: string, datetime: Date, tag: string, title: string }) {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "post"),
      { account: post.account, context: post.context, datetime: new Date(), tag: post.tag, title: post.title });
    console.log("Document written with ID: ", docRef.id);

    setUpdated((currentValue) => currentValue + 1)
  }

  async function deletePost(id: string) {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "post", id));
      setUpdated((currentValue) => currentValue + 1)
    }
    catch (error) {
      console.log("id = "+id)
      console.error(error);
    }

  }

  async function updatePost(post:  Post) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "post", post.id),
        { id: post.id, context: post.context, title: post.title, tag: post.tag });
      setUpdated((currentValue) => currentValue + 1)
    }
    catch (error) {
      console.error(error);
    }

  }

  function setUpdatePosts(post: Post) {
    setNewPost({ ...post, visible: true })
  }





  return [posts, setPosts, addPost, deletePost, updatePost, setUpdatePosts] as const;


  // return [posts, setPosts] as const;
}

export default usePosts;
function setNewPost(arg0: { visible: boolean; id: string; account: string; context: string; datetime: Date; tag: string; title: string; }) {
  throw new Error("Function not implemented.");
}

