import React from "react";
import Modal from "react-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import axios from "axios";

// React-modal settings
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%"
  },
};

Modal.setAppElement(document.getElementById("root"));

const ModifyForm = ({
  setShowModifyForm,
  showModifyForm,
  newContent,
  setNewContent,
  setLoadPosts,
  postId,
}) => {
  async function updatePost(id, e) {
    e.preventDefault();
    newContent.trim();
    var formData = new FormData();
    formData.append("content", newContent);
    let data = JSON.parse(localStorage.getItem("ReponseServeur"));
    //formData.append("attachment", attachment);

    await axios
      .put(`http://localhost:7000/api/posts/${id}`, formData, {
        headers: {
          Authorization: `bearer ${data.token}`,
        },
      })
      .then((res) => res.status(200).json(`posts ${id} updated`))
      .catch((error) => console.log(error));

    setLoadPosts(true);
  }

  return (
    <div>
      <Modal
        isOpen={showModifyForm}
        style={customStyles}
        contentLabel="Modify your post"
      >
        <form className="modalModifyPost">
          <Row>
            <Col>
              <label></label>
                <textarea
                  value={newContent}
                  id="newContent"
                  onChange={(e) => setNewContent(e.target.value)}
                />
              
            </Col>
          </Row>
          <Row>
            <Col className="text-center">Modifier l'image</Col><Col className="text-center">Preview de l'image</Col>
          </Row>
          <Row>
            <Col xs="6">
              <button
                onClick={(e) => {
                  updatePost(postId, e);
                  setShowModifyForm(false);
                }}
              >
                Apply
              </button>
            </Col>
            <Col xs="6">
              <button onClick={() => setShowModifyForm(false)}>Cancel</button>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default ModifyForm;
