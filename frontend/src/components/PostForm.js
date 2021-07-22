import React from "react";
import { useState } from "react";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  //const postError = document.getElementById("postError");

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));  
  
  let myHeaders = new Headers();

    myHeaders.append("authorization",'bearer ' + data.token);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

  const handlePost = (e) => {

    let donnees = {
      "post": {
          "userId": data.userId,
          "content": content,
          "attachment": attachment
      }
    };

  const reqOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(donnees),
  } 
  
  e.preventDefault();

    fetch('http://localhost:7000/api/posts', reqOptions)
    .then(function(response) {
    return response.json();
  }).then(function(data) {
  });
  };

  return (
    <div className="posts">
    <form action="" onSubmit={handlePost} id="postForm">
      <h1>What's up ?</h1>
      <label htmlFor="email">Content</label>
      <textarea
        name="content"
        id="content"
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <label htmlFor="attachment">Add a picture to your post (jpg, jpeg, png):</label>
      <input
        type="file"
        name="attachment"
        id="attachment"
        onChange={(e) => setAttachment(e.target.value)}
        accept="image/png, image/jpeg"
        value={attachment}
      />
      <input type="submit" value="post" />
      <div id="postError"></div>
    </form>
    </div>
  );
};

export default PostForm;
