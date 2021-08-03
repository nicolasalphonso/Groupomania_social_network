import PostCard from "./PostCard";
import axios from "axios";
import { useState, useEffect } from "react";
import PostForm from "./PostForm";

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const Thread = () => {
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  const [posts, setPosts] = useState({});
  const [loadPosts, setLoadPosts] = useState(true);

  useEffect(() => {
    if (loadPosts) {
      axios
        .get("http://localhost:7000/api/posts", {
          headers: {
            Authorization: `bearer ${data.token}`,
          },
        })
        .then((res) => setPosts(res.data))
        .catch((error) => console.log(error));
    }
    setLoadPosts(false);
  }, [loadPosts, data.token]);

  return (
    <div className="thread-container">
      <h1>Fresh news of Groupomania network</h1>
      <PostForm setLoadPosts={setLoadPosts}/>
      <ul>
        {!isEmpty(posts) &&
          posts.map((post) => {
            return <PostCard post={post} key={post.id} setLoadPosts={setLoadPosts} posts={posts}/>;
          })}
      </ul>
    </div>
  );
};

export default Thread;
