import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import axios from "axios";

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  console.log(obj);
  return true;
}

function nameFormat(name) {
  return name[0].toUpperCase() + name.substring(1).toLowerCase();
}

function PersonalProfile({ setLoadProfile, userToDisplay }) {
  const [newUsername, setNewUsername] = useState("");
  const [newFirstname, setNewFirstname] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const data = JSON.parse(localStorage.getItem("ReponseServeur"));

  // setting the options for the authenticated request
  const userId = data.userId;

  async function updatePhoto(e) {
    e.preventDefault();
    const [file] = document.getElementById("newPhoto").files;

    var formData = new FormData();
    formData.append("previousImageUrl", userToDisplay.data.attachment);
    formData.append("attachment", file);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);

    var myInit = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
    };

    await fetch(
      `http://localhost:7000/api/auth/profile/${userId}/photo`,
      myInit
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setLoadProfile(true);
      })
      .catch((error) => console.log(error));

    document.getElementById("formPhoto").reset();
  }

  async function handleUpdateData(e, type, value) {
    const updateData = {
      type: type,
      value: value,
    };

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${data.token}`);
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var myInit = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(updateData),
    };

    await fetch(
      `http://localhost:7000/api/auth/profile/${userId}/infos`,
      myInit
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        setLoadProfile(true);
      })
      .catch((error) => console.log(error));

    setLoadProfile(true);
  }

  function offFocus(element) {
    element.setAttribute("readonly", true);
    element.classList.add("form-control-plaintext");
    element.classList.remove("onFocus");
    setLoadProfile(true);
  }

  function onFocus(element) {
    element.removeAttribute("readonly");
    element.classList.remove("form-control-plaintext");
    element.classList.add("onFocus");
    element.focus();
  }

  function handlePreview() {
    const [file] = document.getElementById("newPhoto").files;
    if (file) {
      document.getElementById("profilePhoto").src = URL.createObjectURL(file);
    }
  }

  async function handleDeleteAccount() {
    if (window.confirm("Do you want to delete your account ?")) {
      if (
        window.confirm("Are you really sure you want to delete your account ?")
      ) {
        localStorage.removeItem("ReponseServeur");
            window.location.replace("/");
            
        await axios
          .delete(`http://localhost:7000/api/auth/profile/${userId}`, {
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
  }

  return (
    !isEmpty(userToDisplay) && (
      <Container className="profileCard">
        <Row className="text-center">
          <Col>
            <div className="bg-white rounded shadow-sm py-5 px-4">
              <h1 className="mb-0 nameDisplay">
                {nameFormat(userToDisplay.data.firstname)}{" "}
                {nameFormat(userToDisplay.data.lastname)}
              </h1>
              <p className="small text-muted">{userToDisplay.data.username}</p>
              <p>{userToDisplay.data.bio}</p>
              <img
                src={userToDisplay.data.attachment}
                alt={`Profile of ${userToDisplay.data.username}`}
                width="200"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                id="profilePhoto"
              />
              <Form
                id="formPhoto"
                className="formPhoto"
                onSubmit={(e) => updatePhoto(e)}
              >
                <Form.Group className="mb-3" controlId="newPhoto">
                  <Form.Label>Choose a new photo </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      handlePreview();
                    }}
                    type="file"
                    size="sm"
                    accept="image/png, image/jpeg"
                  />
                </Form.Group>
                <Button variant="secondary" type="submit">
                  Confirm photo update
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={() => {
                    document.getElementById("profilePhoto").src =
                      userToDisplay.data.attachment;
                  }}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
        <Form
          className="formProfile"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateData(e, "username", newUsername);
            offFocus(document.getElementById("username"));
          }}
        >
          <Form.Group className="mb-3" controlId="username">
            <Form.Label
              onClick={() => {
                onFocus(document.getElementById("username"));
              }}
            >
              Username{" "}
              <img
                src="icones/edit.svg"
                className="profileModifyIcon"
                alt="modify username"
              />
            </Form.Label>
            <Form.Control
              type="input"
              value={newUsername}
              placeholder={userToDisplay.data.username}
              readOnly
              plaintext
              onChange={(e) => setNewUsername(e.target.value)}
              onBlur={() => {
                offFocus(document.getElementById("username"));
              }}
            />
          </Form.Group>
          <div id="usernameErrors" className="formErrors"></div>
        </Form>
        <Form
          className="formProfile"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateData(e, "firstname", newFirstname);
            offFocus(document.getElementById("firstname"));
          }}
        >
          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label
              onClick={() => {
                onFocus(document.getElementById("firstname"));
              }}
            >
              Firstname{" "}
              <img
                src="icones/edit.svg"
                className="profileModifyIcon"
                alt="modify firstname"
              />
            </Form.Label>
            <Form.Control
              type="input"
              value={newFirstname}
              placeholder={userToDisplay.data.firstname}
              readOnly
              plaintext
              onChange={(e) => setNewFirstname(e.target.value)}
              onBlur={() => {
                offFocus(document.getElementById("firstname"));
              }}
            />
          </Form.Group>
          <div id="firstnameErrors" className="formErrors"></div>
        </Form>
        <Form
          className="formProfile"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateData(e, "lastname", newLastname);
            offFocus(document.getElementById("lastname"));
          }}
        >
          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label
              onClick={() => {
                onFocus(document.getElementById("lastname"));
              }}
            >
              Lastname{" "}
              <img
                src="icones/edit.svg"
                className="profileModifyIcon"
                alt="modify lastname"
              />
            </Form.Label>
            <Form.Control
              type="input"
              value={newLastname}
              placeholder={userToDisplay.data.lastname}
              readOnly
              plaintext
              onChange={(e) => setNewLastname(e.target.value)}
              onBlur={() => {
                offFocus(document.getElementById("lastname"));
              }}
            />
          </Form.Group>
          <div id="lastnameErrors" className="formErrors"></div>
        </Form>
        <Button variant="danger" onClick={() => handleDeleteAccount()}>
          Delete Account
        </Button>{" "}
      </Container>
    )
  );
}

export default PersonalProfile;
