import React, { useState, useEffect } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

function Comments({ postId, comments, }) {
  
  
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  

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
                    <div class=" row userAndContent">
                      <Row>
                        {comment.User.username} -
                        <span className="commentDate">
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            dateOptions
                          )}
                        </span>
                      </Row>
                      <Row>{comment.content}</Row>
                    </div>
                  </Col>
                  <Row>
                    <Col
                      xs={{ span: 3, offset: 3 }}
                      className="commentDate"
                    ></Col>
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
