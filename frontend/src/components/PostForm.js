import React from "react";
import { useState } from "react";
import axios from "axios";
import emptyPreview from "../images/empty_preview.png";

const PostForm = ({ setLoadPosts }) => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const [showingPostform, setShowingPostform] = useState(false);
  const contentError = document.getElementById("contentError");

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  async function handlePost(e) {
    e.preventDefault();
    content.trim();
    var formData = new FormData();
    formData.append("content", content);
    formData.append("attachment", attachment);

    if (!content) {
      contentError.innerHTML = "The content of the post is required";
    } else {
      await axios
        .post("http://localhost:7000/api/posts", formData, {
          headers: {
            Authorization: `bearer ${data.token}`,
          },
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.error(error));
    }

    // rerender the thread
    setLoadPosts(true);

    // empty and close post form
    setContent("");
    document.getElementById("imagePreview").src = emptyPreview;
    setShowingPostform(false);
  }

  function handlePreview() {
    const [file] = document.getElementById("attachment").files;
    if (file) {
      document.getElementById("imagePreview").src = URL.createObjectURL(file);
    }
  }

  return (
    <div className="posts form">
      {showingPostform &&
  
      <form action="" onSubmit={handlePost} id="postForm">
        <button aria-label="hide post form" onClick={() => setShowingPostform(false)}>Hide</button>
        <br/>
        <label htmlFor="content">Something to share !?</label>
        <textarea
          name="content"
          id="content"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="what's up ?"
          rows="5"
          required
        />
        <div id="contentError" />
        <label htmlFor="attachment" aria-label="add a photo to your post">Add a photo</label>
        <input
          type="file"
          name="attachment"
          id="attachment"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setAttachment(e.target.files[0]);
            handlePreview();
          }}
        />
        <img id="imagePreview" src={emptyPreview} alt="your upload" />
        <div id="imageError" />
        <input type="submit" value="post" />
        <div id="postError"></div>
      </form>}
      {!showingPostform && <button onClick={() => setShowingPostform(true)}>What's up !? Click to post</button>}
    </div>
  );
};

export default PostForm;
