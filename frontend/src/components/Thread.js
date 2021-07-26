import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getAllPosts } from "../actions/post.actions";


function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

const Thread = () => {
  // I use this state to load the posts only once
  const [loadPost, setLoadPost] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (loadPost) {
      // I fulfill the store
      dispatch(getAllPosts());
      // I avoid the dispatch of GetAllPosts
      setLoadPost(false);
    }
  }, [loadPost, dispatch]);

  return (
    <div className="thread-container">
      <ul>
        {posts.map((post) => {
          return <li>{post.id}</li>
        })}
      </ul>
    </div>
  );
};

export default Thread;