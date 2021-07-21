import React from "react";

class Post {
  constructor(jsonPost) {
    jsonPost && Object.assign(this, jsonPost);
  }
}

const Thread = () => {
  const getAllPosts = () => {
    fetch("http://localhost:7000/api/posts")
      .then((data) => data.json())
      .then((jsonListPosts) => {
        for (let jsonPost of jsonListPosts) {
          let post = new Post(jsonPost);
          console.log(post);
          //display of each post
          document.getElementById("threadDisplay").innerHTML += `
            <div class="posts" >
                <p class="postContent">${post.content}</p>
                <img src="${post.attachment}" alt="Photo du post"/>
            </div>
            `;
        }
      });
  };

  getAllPosts();

  return (
    <div>
      <div></div>
      <div id="threadDisplay"></div>
    </div>
  );
};

export default Thread;
