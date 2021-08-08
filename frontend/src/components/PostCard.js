import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState, useEffect } from "react";
import ModifyForm from "./Modal/ModifyForm";
import Comments from "./Comments";

// setting the options for the dates display
const dateOptions = {
  //  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

////////////
const PostCard = ({ post, setLoadPosts, posts, isAdmin, setShowOtherProfile, setProfileToDisplay }) => {
  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));
  let userId = data.userId;
  // setting of an array of likers from post.likers
  let likersIdString = JSON.parse(post.likers);
  let likersArray = [];
  for (let i = 0; i < likersIdString.length; i++) {
    likersArray.push(likersIdString[i]);
  }

  // usestate for the display of the modify form
  const [showModifyForm, setShowModifyForm] = useState(false);
  // usestate for the content update
  const [newContent, setNewContent] = useState(post.content);
  // usestate for the attachment update
  const [newAttachment, setNewAttachment] = useState(post.attachment);
  // usestate for the display of likes
  const [userLiked, setUserLiked] = useState(likersArray.includes(userId));
  // usestate for the comment contents set
  const [commentContent, setCommentContent] = useState("");
  // usestates to update and re-render the comments
  const [loadComments, setLoadComments] = useState(true);
  const [comments, setComments] = useState("");

  // function to handle click on "like" button
  async function handleLike() {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);

    let myInit = {
      method: "POST",
      headers: myHeaders,
    };

    await fetch(`http://localhost:7000/api/posts/${post.id}/like`, myInit)
      .then((res) => res.json())
      .then((res) => {
        post.likers = res.newLikers;
        setUserLiked(res.Liked);
      });
  }

  //function to delete the post
  async function deletePost(id) {
    // delete the post from the database
    // verify again that the user is the correct one
    if (userId === post.User.id) {
      if (window.confirm("Delete your post ?")) {
        await axios
          .delete(`http://localhost:7000/api/posts/${id}`, {
            headers: {
              Authorization: `bearer ${data.token}`,
            },
          })
          .then((res) => res.status(200).json(`posts ${id} deleted`))
          .catch((error) => console.log(error));

        // rerender the thread
        setLoadPosts(delete posts.post);
      }
    } else {
      //force the user to relog
      alert("Session issue, please sign in again");
      window.location("/");
    }
  }

  // useEffect to re-render the comments
  useEffect(() => {
    if (loadComments) {
      axios
        .get(`http://localhost:7000/api/comments/${post.id}`, {
          headers: {
            Authorization: `bearer ${data.token}`,
          },
        })
        .then((res) => setComments(res.data))
        .catch((error) => console.log(error));
    }
    setLoadComments(false);
  }, [loadComments, post.id, data.token]);

  // function to post a comment
  async function handlePostComment(userId, postId, e) {
    e.preventDefault();
    console.log("userId : " + userId);
    console.log("postId : " + postId);
    console.log("commentContent : " + commentContent);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);
    //myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    let dataPostContent = {
      userId: userId,
      postId: post.id,
      commentContent: commentContent,
    };

    let myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(dataPostContent),
    };

    await fetch(`http://localhost:7000/api/comments/`, myInit)
      .then((res) => res.json())
      .then((res) => {
        console.log("new comment id : " + res.newCommentId);
        console.log(res);
        setCommentContent("");
        setLoadComments(true);
      });
  }

  return (
    <li key={post.id}>
      <p>
        userId : {userId} , post.User.id : {post.User.id}
      </p>
      <Card>
        <Card.Body>
          <Card.Title className="postPosterInfos">
            <Row >
              <Col xs="1" md="1" onClick={() => {
              setProfileToDisplay(post.User);
              setShowOtherProfile(true);
            }}>
                <img
                  src={post.User.attachment}
                  className="threadIconProfile"
                  alt={`Profile of ${post.User.username}`}
                />
              </Col>
              <Col xs="7" md="9" onClick={() => {
              setProfileToDisplay(post.User);
              setShowOtherProfile(true);
            }}>
                {post.User.username}
                <br />
                {new Date(post.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}
              </Col>
              
                <Col xs="4" md="2">
                  <Row>
                    {post.User.id === userId ? (
                      <Col xs="6">
                        <img
                          src="icones/modify.png"
                          alt="Modify post"
                          className="posts__icon btn-modify"
                          onClick={() => {
                            setShowModifyForm(true);
                          }}
                        />
                      </Col>
                    ) : null }
                    {(post.User.id === userId || isAdmin) ? (
                      <Col xs="6">
                        <img
                          src="icones/delete.png"
                          alt="Delete post"
                          className="posts__icon btn-delete"
                          onClick={() => deletePost(post.id)}
                        />
                      </Col>
                    ) : null}
                  </Row>
                </Col>
            </Row>
          </Card.Title>
          <Card.Text className="displayLineBreak">
            <br />
            {newContent}
          </Card.Text>
        </Card.Body>
        {post.attachment !== "NULL" && (
          <Card.Img
            src={post.attachment}
            alt={`Photo postée par ${post.User.username}`}
          />
        )}
        <Card.Footer>
          <Row>
            <Col className="text-center">
              <img
                src={
                  userLiked
                    ? "icones/heart_liked.png"
                    : "icones/heart_unliked.png"
                }
                alt="Like post"
                className="posts__icon btn-like"
                onClick={() => handleLike()}
              />
              <span>{likersArray.length}</span>
            </Col>
            <Col className="text-center">
              <img
              onClick={() => {
                document.getElementById(`addComment${post.id}`).focus();
              }}
                src="icones/comment.png"
                alt="Comment post"
                className="posts__icon btn-comment"
              />
            </Col>
          </Row>
          <Row>
            <Comments
              postId={post.id}
              comments={comments}
              setLoadComments={setLoadComments}
              userId={userId}
              isAdmin={isAdmin}
              setShowOtherProfile={setShowOtherProfile}
              setProfileToDisplay={setProfileToDisplay}
            />
          </Row>
          <Row>
            <Form onSubmit={(e) => handlePostComment(userId, post.id, e)}>
              <Col xs="3">
                <label htmlFor={`addComment${post.id}`}>Add a comment</label>
              </Col>
              <Col xs="9">
                <input
                  type="text"
                  id={`addComment${post.id}`}
                  name={`addComment${post.id}`}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </Col>
            </Form>
          </Row>
        </Card.Footer>
      </Card>
      {showModifyForm && (
        <ModifyForm
          setShowModifyForm={setShowModifyForm}
          showModifyForm={showModifyForm}
          newContent={newContent}
          setNewContent={setNewContent}
          postContent={post.content}
          postId={post.id}
          setLoadPosts={setLoadPosts}
          setNewAttachment={setNewAttachment}
          newAttachment={newAttachment}
        />
      )}
    </li>
  );
};

export default PostCard;
