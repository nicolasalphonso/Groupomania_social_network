import React from "react";
import Modal from "react-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
    width: "60%",
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
}) => {
  const previousContent = newContent;
  const previousAttachment = newAttachment; 

  function handlePreview() {
    const [file] = document.getElementById("attachment").files;
    if (file) {
      document.getElementById("imagePreview").src = URL.createObjectURL(file);
    }
    setNewAttachment(URL.createObjectURL(file))
  }

  async function updatePost(id, e) {
    e.preventDefault();

    let data = JSON.parse(localStorage.getItem("ReponseServeur"));

    var formData = new FormData();
    formData.append("content", newContent.trim());
    //formData.append("attachment", attachment);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);

    var myInit = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
    };

    await fetch(`http://localhost:7000/api/posts/${id}`, myInit)
      .then((res) => res.json())
      .then((res) => {
        setNewContent(res.updatedContent);
      })
      .catch((error) => console.log(error));

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
            <Col className="text-center"><label htmlFor="attachment"></label>
        <input
          type="file"
          name="attachment"
          id="attachment"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setNewAttachment(e.target.files[0]);
            handlePreview();
          }}
        /></Col>
            <Col className="text-center"><img id="imagePreview" src={(newAttachment != "NULL") ? newAttachment : emptyPreview} alt="your upload" /></Col>
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
              <button onClick={() => {
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
