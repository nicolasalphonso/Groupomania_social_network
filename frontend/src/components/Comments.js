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

/** Functional component : displays a comment
 * and, when needed, a form to modify it
 */
function Comments({
  comments,
  setLoadComments,
  userId,
  isAdmin,
  setProfileToDisplay,
  setShowOtherProfile,
}) {
  // usestate to set the display of the modify comment div
  const [displayModifyComment, setdisplayModifyComment] = useState(false);
  // usestate for the text to modify the comment
  const [newComment, setNewComment] = useState("");
  // usestate to select the comment to modify
  const [commentToModify, setCommentToModify] = useState(null);

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));

  /** function to delete the comment associated
   * 
   * @param {*} comment : comment to delete
   */
  async function handleDeleteComment(comment) {
    if (userId === comment.User.id || isAdmin) {
      if (window.confirm("Delete your comment ?")) {
        await axios
          .delete(`http://localhost:7000/api/comments/${comment.id}`, {
            headers: {
              Authorization: `bearer ${data.token}`,
            },
          })
          .then(() => console.log(`Comment ${comment.id} deleted`))
          .catch((error) => console.log(error));

        // rerender the comments
        setLoadComments(true);
      }
    } else {
      //force the user to relog
      alert("Session issue, please sign in again");
      localStorage.removeItem("ReponseServeur");
      window.location.assign("/");
    }
  }

  /** function to modify the comment associated
   * 
   * @param {*} comment : comment to modify
   */
  async function handleModifyComment(e, comment) {
    e.preventDefault();

    // fetch settings
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
        .then(() => console.log(`Comment ${comment.id} updated`))
        .catch((error) => console.log(error));

      // rerender the comments
      setLoadComments(true);

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
                <Row className="commentGlobal">
                  <Col
                    xs="1" md="1"
                    className="m-auto"
                    onClick={() => {
                      setProfileToDisplay(comment.User);
                      setShowOtherProfile(true);
                    }}
                  >
                    <img
                      className="commentPhotoProfile"
                      src={comment.User.attachment}
                      alt={`Profile of ${comment.User.username}`}
                    />
                  </Col>
                  <Col xs="11" md="11">
                    <div className="row userAndContent">
                      <Row>
                        <Col xs="9" className="commentInfos">
                          {comment.User.username} -
                          <span className="commentDate">
                            {new Date(comment.createdAt).toLocaleDateString(
                              undefined,
                              dateOptions
                            )}
                          </span>
                        </Col>

                        <Col xs="3">
                          <Row>
                            {comment.User.id === userId && (
                              <Col xs="6" className="commentIcon">
                                <img
                                  src="icones/edit.svg"
                                  alt="edit your comment"
                                  className="commentIcon"
                                  onClick={() => {
                                    setCommentToModify(comment.id);
                                    setNewComment(comment.content);
                                    setdisplayModifyComment(
                                      !displayModifyComment
                                    );
                                  }}
                                />
                              </Col>
                            )}

                            {comment.User.id === userId || isAdmin ? (
                              <Col xs="6">
                                <img
                                  src="icones/trash.svg"
                                  alt="delete your comment"
                                  className="commentIcon"
                                  onClick={() => handleDeleteComment(comment)}
                                />
                              </Col>
                            ) : null}
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="commentContent">{comment.content}</Col>
                      </Row>
                      {comment.User.id === userId &&
                        displayModifyComment &&
                        commentToModify === comment.id && (
                          <Form
                            className="displayModifyComment"
                            onSubmit={(e) => handleModifyComment(e, comment)}
                            onBlur={() => { setdisplayModifyComment(false) }}
                          >
                            <Row><Col xs="12" md="2">Edit your comment :</Col>
                              <Col xs="9">
                                <input
                                  type="text"
                                  id={`newComment${comment.id}`}
                                  name={`newComment${comment.id}`}
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  autoFocus
                                  className="modifyInput"
                                  maxLength="65000"
                                />
                              </Col>
                            </Row>
                          </Form>
                        )}
                    </div>
                  </Col>
                  <Row>
                    <Col md={{ span: 3, offset: 3 }}></Col>
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
