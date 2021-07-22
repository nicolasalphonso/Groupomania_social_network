import React from "react";
import { useState } from "react";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  //const postError = document.getElementById("postError");

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));   

  const handlePost = (e) => {

    let donnees = {
      "post": {
          "userId": 2,
          "content": "Post généré par Postman",
          "attachment": "zozor.jpg"
      }
    };

  const reqOptions = {
    method: 'POST',
    headers: { "Authorization": 'Bearer ' + data.token},
    body: JSON.stringify(donnees),
  }
  
  console.log(JSON.stringify(donnees));
    
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
      <label htmlFor="password">Image</label>
      <input
        type="text"
        name="attachment"
        id="attachment"
        onChange={(e) => setAttachment(e.target.value)}
        value={attachment}
      />
      <input type="submit" value="post" />
      <div id="postError"></div>
    </form>
    </div>
  );
};

export default PostForm;
