import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deletePost } from "../actions/post.actions";
import { useDispatch} from "react-redux";

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

// setting the options for the authenticated request
let data = JSON.parse(localStorage.getItem("ReponseServeur"));
let userId = data.userId;

console.log(userId);

const PostCard = ({ post }) => {

const dispatch = useDispatch();
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
              {post.User.id === userId ? (
                
                  <Row>
                    <Col xs="6">
                      <img
                        src="icones/modify.png"
                        alt="Modify post"
                        class="posts__icon btn-modify"
                      />
                    </Col>
                    <Col xs="6">
                      <img
                        src="icones/delete.png"
                        alt="Delete post"
                        class="posts__icon btn-delete"
                        onClick={deletePost(post.id)}
                      />
                    </Col>
                  </Row>
                
              ) : (
                ""
              )}
              </Col>
            </Row>
          </Card.Title>
          <Card.Text>
            <br />
            {post.content}
          </Card.Text>
        </Card.Body>
        {post.attachment !== "NULL" ? <Card.Img src={post.attachment} /> : ""}
        <Card.Footer>
          <Row>
            <Col className="text-center">
              <img
                src="icones/heart_liked.png"
                alt="Like post"
                class="posts__icon btn-like"
              />
            </Col>
            <Col className="text-center">
              <img
                src="icones/comment.png"
                alt="Comment post"
                class="posts__icon btn-comment"
              />
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </li>
  );
};

export default PostCard;
