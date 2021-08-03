import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
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

function PersonalProfile() {
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [loadProfile, setLoadProfile] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newFirstname, setNewFirstname] = useState(null);
  const [newLastname, setNewLastname] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  // setting the options for the authenticated request
  let data = JSON.parse(localStorage.getItem("ReponseServeur"));
  const userId = data.userId;

  useEffect(() => {
    axios
      .get(`http://localhost:7000/api/auth/profile/${userId}`, {
        headers: {
          Authorization: `bearer ${data.token}`,
        },
      })
      .then((response) => {
        setUserToDisplay(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      })
      .finally(() => {
        setLoadProfile(false);
      });
  }, [loadProfile]);

  async function updatePhoto(e) {
    e.preventDefault();
    const [file] = document.getElementById("newPhoto").files;
    let data = JSON.parse(localStorage.getItem("ReponseServeur"));

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
  }

  function handlePreview() {
    const [file] = document.getElementById("newPhoto").files;
    if (file) {
      document.getElementById("profilePhoto").src = URL.createObjectURL(file);
    }
  }

  return (
    !isEmpty(userToDisplay) && (
      <Container className="profileCard">
        <Row className="text-center">
          <Col>
            <div className="bg-white rounded shadow-sm py-5 px-4">
              <img
                src={userToDisplay.data.attachment}
                alt="Profile photo"
                width="200"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                id="profilePhoto"
              />

              <p className="mb-0 nameDisplay">
                {nameFormat(userToDisplay.data.firstname)}{" "}
                {nameFormat(userToDisplay.data.lastname)}
              </p>
              <p className="small text-muted">{userToDisplay.data.username}</p>
              <p>{userToDisplay.data.bio}</p>
            </div>
          </Col>
        </Row>

        <h1>Modify your profile</h1>
        <Form className="formProfile" onSubmit={(e) => updatePhoto(e)}>
          <Form.Group className="mb-3">
            <Form.Label>Photo </Form.Label>
            <Form.Control
              onChange={(e) => {
                setNewPhoto(e.target.files[0]);
                handlePreview();
              }}
              type="file"
              size="sm"
              id="newPhoto"
              accept="image/png, image/jpeg"
            />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Change photo
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

        <Form className="formProfile">
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="input" placeholder="Enter new username" />
          </Form.Group>
          <div id="usernameErrors" className="formErrors"></div>
          <Button variant="secondary" type="submit">
            Modify my username
          </Button>
          <Button variant="secondary" type="reset">
            Cancel
          </Button>
        </Form>

        <Form className="formProfile">
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter new email" />
          </Form.Group>
          <div id="emailErrors" className="formErrors"></div>
          <Button variant="secondary" type="submit">
            Modify my Email
          </Button>
          <Button variant="secondary" type="reset">
            Cancel
          </Button>
        </Form>

        <Form className="formProfile">
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" />
          </Form.Group>
          <div id="passwordErrors" className="formErrors"></div>
        </Form>

        <Form className="formProfile">
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control type="password" placeholder="Confirm new password" />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Modify my password
          </Button>
          <Button variant="secondary" type="reset">
            Cancel
          </Button>
        </Form>

        {userToDisplay.data.isAdmin && (
          <Form className="formProfile">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="radio" label="Admin" name="isAdmin" checked />
              <Form.Check type="radio" label="Not Admin" name="isAdmin" />
            </Form.Group>
          </Form>
        )}
      </Container>
    )
  );
}

export default PersonalProfile;
