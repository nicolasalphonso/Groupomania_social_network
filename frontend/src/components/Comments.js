import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Form from "react-bootstrap/Form";

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
  // usestate to set the display of the modify comment div
  const [displayModifyComment, setdisplayModifyComment] = useState(false);
  // usestate for the text to modify the comment
  const [newComment, setNewComment] = useState("");

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

  async function handleModifyComment(e, comment) {
    e.preventDefault();

    if (userId === comment.User.id) {
      let dataModifyComment = {
        content: newComment.trim(),
      };

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `bearer ${data.token}`);
      myHeaders.append("Content-type", "application/json");

      var myInit = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(dataModifyComment),
      };

      await fetch(`http://localhost:7000/api/comments/${comment.id}`, myInit)
        .then((res) => res.status(200).json(`Comment ${comment.id} updated`))
        .catch((error) => console.log(error));

      // rerender the comments
      setLoadComments(true);

      // reset the form used et modify the comment
      //setNewComment("");

      // hide the form
      setdisplayModifyComment(false);
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
                  <Col xs="1" className="m-auto">
                    <img
                      className="commentPhotoProfile"
                      src={comment.User.attachment}
                      alt={`Profile of ${comment.User.username}`}
                    />
                  </Col>
                  <Col xs="11">
                    <div class="row userAndContent">
                      <Row>
                        <Col xs="9">
                          {comment.User.username} -
                          <span className="commentDate">
                            {new Date(comment.createdAt).toLocaleDateString(
                              undefined,
                              dateOptions
                            )}
                          </span>
                        </Col>
                        {comment.User.id === userId && (
                          <Col xs="3">
                            <Row>
                              <Col xs="6">
                                <img
                                  src="icones/edit.svg"
                                  alt="edit your comment"
                                  className="commentIcon"
                                  onClick={() =>
                                    setdisplayModifyComment(
                                      !displayModifyComment
                                    )
                                  }
                                />
                              </Col>
                              <Col xs="6">
                                <img
                                  src="icones/trash.svg"
                                  alt="delete your comment"
                                  className="commentIcon"
                                  onClick={() => handleDeleteComment(comment)}
                                />
                              </Col>
                            </Row>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <Col>{comment.content}</Col>
                      </Row>
                      {comment.User.id === userId && displayModifyComment && (
                        /*comment.id === && */ <Form
                          onSubmit={(e) => handleModifyComment(e, comment)}
                        >
                          <Row>
                            <input
                              type="text"
                              id="newComment"
                              name="newComment"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </Row>
                        </Form>
                      )}
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
