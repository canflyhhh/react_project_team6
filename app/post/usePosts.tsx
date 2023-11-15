import { addDoc, collection, getDocs, getFirestore, deleteDoc, doc, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useEffect, useState } from "react";
import { Post } from "../_settings/interfaces";

function usePosts() {
  // Firebase Firestore instance
  const db = getFirestore(app);

  // State to store the list of posts
  const [posts, setPosts] = useState<Post[]>([]);

  // State to force a re-render when data is updated
  const [updated, setUpdated] = useState(0);

  // Function to fetch posts from Firestore
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

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [updated]);

  // Return the posts and a function to set posts (useful for updating state externally)
  return [posts, setPosts] as const;
}

export default usePosts;


