import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useState } from "react";
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

// setting the options for the authenticated request
let data = JSON.parse(localStorage.getItem("ReponseServeur"));
let userId = data.userId;

////////////
const PostCard = ({ post, setLoadPosts, posts }) => {
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

  // function to handle click on "like" button
  async function handleLike() {
    let data = JSON.parse(localStorage.getItem("ReponseServeur"));
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);

    var myInit = {
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

  return (
    <li key={post.id}>
      <p>
        userId : {userId} , post.User.id : {post.User.id}
      </p>
      <Card>
        <Card.Body>
          <Card.Title as="p">
            <Row>
              <Col xs="8" md="10">
                {post.User.username}
                <br />
                {new Date(post.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}
              </Col>
              <Col xs="4" md="2">
                {post.User.id === userId && (
                  <Row>
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
                    <Col xs="6">
                      <img
                        src="icones/delete.png"
                        alt="Delete post"
                        className="posts__icon btn-delete"
                        onClick={() => deletePost(post.id)}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Card.Title>
          <Card.Text className="displayLineBreak">
            <br />
            {newContent}
          </Card.Text>
        </Card.Body>
        {post.attachment !== "NULL" && <Card.Img src={post.attachment} />}
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
                src="icones/comment.png"
                alt="Comment post"
                className="posts__icon btn-comment"
              />
            </Col>
          </Row>
          <Row>
            <Comments postId={post.id}/>
          </Row>
          <Row>
            <Col xs="3"><label for="addComment">Add a comment</label></Col>
            <Col xs="9"><input type="text" id="addComment" name="addComment"/></Col>
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
