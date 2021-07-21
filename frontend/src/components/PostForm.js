import React from "react";
import { useState } from "react";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const postError = document.getElementById("postError");

  const handlePost = (e) => {
    e.preventDefault();

    let donnees = {
      content: content,
      attachment: attachment,
    };

    console.log(donnees);

    fetch("http://localhost:7000/api/posts", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(donnees),
      })
      .then((response) => response.json())
      .then((resultat) => {
        localStorage.setItem("ReponseServeur", JSON.stringify(resultat));
        if(resultat.error) {
            postError.innerHTML = resultat.error;
        } else {
            window.location='/home';
        }
      })
      .catch((error) => {
        console.error("Erreur de fetch POST:", error);
      });
  };

  return (
    <div className="posts">
    <form action="" onSubmit={handlePost} id="postForm">
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
