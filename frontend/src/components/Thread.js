import PostCard from "./PostCard";
import axios from "axios";
import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import jwt_decode from "jwt-decode";
import OtherProfile from "./Modal/OtherProfile";

/** Function : checks if an object is empty 
 * 
 * @param {*} obj : object to study
 * @returns true if object is empty, else returns false
 */
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

/** functionnal component : main thread
 * displays PostForm, PostCard and OtherProfile
 */
const Thread = () => {
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  // checking if user is admin
  const decodedtoken = jwt_decode(data.token);
  const isAdmin = decodedtoken.isAdmin;

  /* local states :
  * posts : all the posts of the thread
  * loadPosts : render the posts if true
  * showOtherProfile : show the modal "OtherProfile"
  * profileToDisplay : profile to display in the modal "OtherProfile"
  * 
  */
  const [posts, setPosts] = useState({});
  const [loadPosts, setLoadPosts] = useState(true);
  const [showOtherProfile, setShowOtherProfile] = useState(false);
  const [profileToDisplay, setProfileToDisplay] = useState(null);

  // query of posts when local state loadposts is true
  // sets loadposts false when finished
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
