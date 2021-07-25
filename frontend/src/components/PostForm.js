import React from "react";
import { useState } from "react";
import axios from "axios";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const postError = document.getElementById("postError");
  const contentError = document.getElementById("contentError");
  const imageError = document.getElementById("imageError");

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  let myHeaders = new Headers();

  myHeaders.append("Authorization", "bearer " + data.token);
  myHeaders.append("Content-Type", "application/json");
  //  myHeaders.append("Accept", "application/json");

  const handlePost = (e) => {
    content.trim();
    var formData = new FormData();
    formData.append("content", content);
    formData.append("attachment", attachment);

    if (!content) {
      contentError.innerHTML = "The content of the post is required";
    } else {
    axios
      .post("http://localhost:7000/api/posts", formData, {
        headers: {
          Authorization: `bearer ${data.token}`,
        },
      })
      .then((res) => console.log(res.data))
      .catch((error) => console.error(error));
    }

    e.preventDefault();

    window.location = "/home";
    }

  return (
    <div className="posts form">
      <form action="" onSubmit={handlePost} id="postForm">
        <label htmlFor="content"></label>
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
        <label htmlFor="attachment">
          Add a picture to your post (jpg, jpeg, png):
        </label>
        <input
          type="file"
          name="attachment"
          id="attachment"
          accept="image/png, image/jpeg"
          onChange={(e) => setAttachment(e.target.files[0])}
        />
        <div id="imageError" />
        <input type="submit" value="post" />
        <div id="postError"></div>
      </form>
    </div>
  );
};

export default PostForm;
