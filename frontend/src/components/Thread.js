import PostCard from "./PostCard";
import axios from "axios";
import { useState, useEffect } from "react";
import PostForm from "./PostForm";
// import of dotenv
/*import env from "react-dotenv";*/
import jwt_decode from "jwt-decode";
import OtherProfile from "./Modal/OtherProfile";

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const Thread = () => {
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  // checking if user is admin
  const decodedtoken = jwt_decode(data.token);
  const isAdmin = decodedtoken.isAdmin;

  const [posts, setPosts] = useState({});
  const [loadPosts, setLoadPosts] = useState(true);
  const [showOtherProfile, setShowOtherProfile] = useState(false);
  const [profileToDisplay, setProfileToDisplay] = useState(null);

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
      <PostForm setLoadPosts={setLoadPosts} />
      <ul>
        {!isEmpty(posts) &&
          posts.map((post) => {
            return (
              <PostCard
                post={post}
                key={post.id}
                setLoadPosts={setLoadPosts}
                posts={posts}
                isAdmin={isAdmin}
                setShowOtherProfile={setShowOtherProfile}
                setProfileToDisplay={setProfileToDisplay}
              />
            );
          })}
      </ul>
      <OtherProfile
        setShowOtherProfile={setShowOtherProfile}
        showOtherProfile={showOtherProfile}
        profileToDisplay={profileToDisplay}
        isAdmin={isAdmin}
        setLoadPosts={setLoadPosts}
      />
    </div>
  );
};

export default Thread;
