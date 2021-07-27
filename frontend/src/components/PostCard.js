import React from "react";
import Card from "react-bootstrap/Card"

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  // setting the options for the dates display
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  

const PostCard = ({ post }) => {
    return (
        <li key={post.id}>
            <Card>
                <Card.Body>
                    <Card.Title>
                        {post.User.username} ({post.User.firstname} {post.User.lastname})
                    </Card.Title>
                    <Card.Text>
                    {new Date(post.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}<br />
                        {post.content}
                    </Card.Text>
                </Card.Body>
                {(post.attachment !== "NULL") ? 
                <Card.Img src={post.attachment} /> : ""}
            </Card>
            {post.id}
        </li>
    );
};

export default PostCard;