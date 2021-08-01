import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

function Comments({ comments, setLoadComments, userId }) {
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  async function handleDeleteComment(comment) {
    if (userId === comment.User.id) {
      if (window.confirm("Delete your comment ?")) {
        await axios
          .delete(`http://localhost:7000/api/comments/${comment.id}`, {
            headers: {
              Authorization: `bearer ${data.token}`,
            },
          })
          .then((res) => res.status(200).json(`Comment ${comment.id} deleted`))
          .catch((error) => console.log(error));

        // rerender the comments
        setLoadComments(true);
      }
    } else {
      //force the user to relog
      alert("Session issue, please sign in again");
      window.location("/");
    }
  }

  return (
    <div>
      <ul>
        {!isEmpty(comments) &&
          comments.map((comment) => {
            return (
              <li key={comment.id}>
                <Row>
                  <Col xs="2">Photo profil</Col>
                  <Col xs="10">
                    <div class="row userAndContent">
                      <Row>
                        <Col xs="10">
                        {comment.User.username} -
                        <span className="commentDate">
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            dateOptions
                          )}
                        </span>
                        </Col>
                        <Col xs="1"><img src="icones/edit.svg" alt="" className="commentIcon" /></Col>
                        <Col xs="1"><img src="icones/trash.svg" alt="" className="commentIcon" onClick={() => handleDeleteComment(comment)}/></Col>
                      </Row>
                      <Row>
                        <Col>{comment.content}</Col>
                
                      </Row>
                    </div>
                  </Col>
                  <Row>
                    <Col xs={{ span: 3, offset: 3 }}></Col>
                  </Row>
                </Row>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Comments;
