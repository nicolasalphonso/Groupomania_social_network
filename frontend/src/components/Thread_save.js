import React, { useEffect, createRef, useRef } from "react";

class Post {
  constructor(jsonPost) {
    jsonPost && Object.assign(this, jsonPost);
  }
}

const DeletePost = (i) => {
  console.log(i);
};

const Thread = () => {
  // setting the options for the dates display
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));
  const reqOptions = {
    headers: { Authorization: "Bearer " + data.token },
  };

  let deleteButtons = document.getElementsByClassName("btn-delete");
    let tableButtonsDelete = [];

    for (let i = 0; i < deleteButtons.length; i++) {
    tableButtonsDelete.push(deleteButtons[i]);
  }

  let deleteButtonsRefs = useRef([]);

  

  useEffect(() => {
  console.log(tableButtonsDelete);
  deleteButtonsRefs.current = tableButtonsDelete.map((element, i) => deleteButtonsRefs.current[i] ?? createRef(element));
  
    /*return () => {
      cleanup
    }*/
  }, []);
  

  
  
  
  

  const getAllPosts = () => {
    fetch("http://localhost:7000/api/posts", reqOptions)
      .then((data) => data.json())
      .then((jsonListPosts) => {
        for (let jsonPost of jsonListPosts) {
          let post = new Post(jsonPost);
          //display of each post
          document.getElementById("threadDisplay").innerHTML += `
            <div class="posts" >
            <div class="postContent">
                <p><span class="username">${post.User.username}</span> (${
            post.User.firstname
          } ${post.User.lastname})</p>
                <img src="icones/modify.png" alt="Modify post" class="posts__icon btn-modify"/>
                  <button
                    class="btn-delete"
                  >
                  <img src="icones/delete.png" alt="Delete post" class="posts__icon"/>
                  </button>
                <p> ${new Date(post.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}</p>
                <p>${post.content}</p>
            </div>
               ${
                 post.attachment !== "NULL"
                   ? `<img src=${post.attachment} alt="Photo du post"/>`
                   : ""
               }
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
