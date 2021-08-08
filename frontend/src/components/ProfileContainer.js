import React from "react";
import Container from "react-bootstrap/esm/Container";
import PersonalProfile from "./PersonalProfile";
import { useState, useEffect } from "react";
import axios from "axios";



function ProfileContainer() {
  const data = JSON.parse(localStorage.getItem("ReponseServeur"));
// setting the options for the authenticated request
const userId = data.userId;
  const [loadProfile, setLoadProfile] = useState(true);
  const [userToDisplay, setUserToDisplay] = useState(null);

  useEffect(() => {
    if (loadProfile) {
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
    }
  }, [loadProfile, data.token, userId]);

  return (
    <Container>
      <PersonalProfile
        setLoadProfile={setLoadProfile}
        userToDisplay={userToDisplay}
      />
    </Container>
  );
}

export default ProfileContainer;
