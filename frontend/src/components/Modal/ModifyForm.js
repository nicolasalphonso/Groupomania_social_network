import React from "react";
import Modal from "react-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import emptyPreview from "../../images/empty_preview_modify.png";

// React-modal settings
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
  },
};

Modal.setAppElement(document.getElementById("root"));

const ModifyForm = ({
  setShowModifyForm,
  showModifyForm,
  newContent,
  setNewContent,
  setNewAttachment,
  newAttachment,
  postId,
  setLoadPosts
}) => {
  const [updatedNewContent, setUpdatedNewContent] = useState(newContent);
  const [updatedNewAttachment, setUpdatedNewAttachment] = useState(newAttachment);

  function handlePreview() {
    const [file] = document.getElementById("attachment").files;
    if (file) {
      document.getElementById("imagePreview").src = URL.createObjectURL(file);
    }
    setUpdatedNewAttachment(URL.createObjectURL(file))
  }

  async function updatePost(id, e) {
    e.preventDefault();

    let data = JSON.parse(localStorage.getItem("ReponseServeur"));

    var formData = new FormData();
    formData.append("content", updatedNewContent.trim());


    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);

    const [file] = document.getElementById("attachment").files;
    if (file) {
      formData.append("previousImageUrl", newAttachment);
      formData.append("attachment", file);
      
  }

    var myInit = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
    };

    await fetch(`http://localhost:7000/api/posts/${id}`, myInit)
      .then((res) => res.json())
      .then((res) => {
        setNewContent(res.updatedContent);
        setUpdatedNewContent(res.updatedContent);
        setNewAttachment(updatedNewAttachment);
      })
      .catch((error) => console.log(error));


      // Hide the modify form
      setShowModifyForm(false);

      // render the thread
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
              <label htmlFor="updatedNewContent">What's new ?</label>
              <textarea
                value={updatedNewContent}
                id="updatedNewContent"
                onChange={(e) => setUpdatedNewContent(e.target.value)}
                maxLength="65000"
              />
            </Col>
          </Row>
          <Row>
            <Col className="text-center"><label htmlFor="attachment">New photo ?</label>
        <input
          type="file"
          name="attachment"
          id="attachment"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setUpdatedNewAttachment(e.target.files[0]);
            handlePreview();
          }}
        /></Col>
            <Col className="text-center"><img id="imagePreview" src={(updatedNewAttachment !== "NULL") ? updatedNewAttachment : emptyPreview} alt="your upload" /></Col>
          </Row>
          <Row>
            <Col xs="6">
              <button
                onClick={(e) => {
                  updatePost(postId, e);
                  
                }}
              >
                Apply
              </button>
            </Col>
            <Col xs="6">
              <button onClick={() => {
                setUpdatedNewContent(newContent);
                setUpdatedNewAttachment(newAttachment);
                setShowModifyForm(false);
              } }>Cancel</button>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default ModifyForm;
