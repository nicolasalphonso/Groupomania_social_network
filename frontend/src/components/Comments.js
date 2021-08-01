import React, { useState, useEffect } from "react";
import axios from "axios";

// function to verify that an objet is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

// setting the options for the dates display
const dateOptions = {
  //  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function Comments({ postId }) {
  const [loadComments, setLoadComments] = useState(true);
  const [comments, setComments] = useState("");
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  useEffect(() => {
    if (loadComments) {
      axios
        .get(`http://localhost:7000/api/comments/${postId}`, {
          headers: {
            Authorization: `bearer ${data.token}`,
          },
        })
        .then((res) => setComments(res.data))
        .catch((error) => console.log(error));
    }
    setLoadComments(false);
  }, [loadComments, data.token]);

  return (
    <div>
      Comments
      <ul>
        {!isEmpty(comments) &&
          comments.map((comment) => {
            return (
              <li key={comment.id}>
                {comment.User.username}
                {comment.content}
                {new Date(comment.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Comments;
