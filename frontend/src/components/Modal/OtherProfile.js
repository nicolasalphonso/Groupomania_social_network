import Modal from "react-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
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
    width: "80%",
  },
};

Modal.setAppElement(document.getElementById("root"));

function nameFormat(name) {
  return name[0].toUpperCase() + name.substring(1).toLowerCase();
}

const OtherProfile = ({
  setShowOtherProfile,
  showOtherProfile,
  profileToDisplay,
  isAdmin,
  setLoadPosts,
}) => {
  async function  deleteProfile(idToDelete) {
    if (isAdmin) {
      if (window.confirm("Do you want to delete this account ?")) {
        if (
          window.confirm("Are you really sure you want to delete this account ?")
        ) {
          const data = JSON.parse(localStorage.getItem("ReponseServeur"));
  
          await axios
            .delete(`http://localhost:7000/api/auth/profile/${idToDelete}`, {
              headers: {
                Authorization: `bearer ${data.token}`,
              },
            })
            .then((resp) => {
              console.log(resp.data);
            })
            .catch((error) => console.log(error));
        }
      }
      setShowOtherProfile(false);
      window.location.assign("/home");
    } else {
      //force the user to relog
      alert("Session issue, please sign in again");
      localStorage.removeItem("ReponseServeur");
      window.location.assign("/");
    }
  }

  return (
    <div>
      <Modal
        isOpen={showOtherProfile}
        style={customStyles}
        contentLabel="Profile of" //
      >
        {profileToDisplay !== null ? (
          <Container className="profileCard">
            <div className="close">
              <img
                src="icones/close.png"
                alt="Close profile"
                onClick={() => {
                  setShowOtherProfile(false);
                }}
              />
            </div>
            <Row className="text-center">
              <Col>
                <div className="bg-white rounded shadow-sm py-5 px-4">
                  <h1 className="mb-0 nameDisplay">
                    {nameFormat(profileToDisplay.firstname)}{" "}
                    {nameFormat(profileToDisplay.lastname)}
                  </h1>
                  <p className="small text-muted">
                    {profileToDisplay.username}
                  </p>
                  <p>{profileToDisplay.bio}</p>
                  <img
                    src={profileToDisplay.attachment}
                    alt={`Profile of ${profileToDisplay.username}`}
                    width="200"
                    className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                    id="profilePhoto"
                  />
                </div>
              </Col>
            </Row>
            {isAdmin ? (
              <Row>
                <Col className="text-center">
                  <Button
                    variant="danger"
                    className="align-center"
                    onClick={() => deleteProfile(profileToDisplay.id)}
                  >
                    Delete Account
                  </Button>
                </Col>
              </Row>
            ) : null}
          </Container>
        ) : null}
      </Modal>
    </div>
  );
};

export default OtherProfile;
