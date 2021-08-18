import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

/** functional component : displays the navigation bar  */
const NavigationBar = () => {

  /** function : handles the logout
   * removes token
   * redirects to the login / registering page
   */
function handleLogout() {
 if( window.confirm("Do you really want to log out !")) {
  localStorage.removeItem("ReponseServeur");
  window.location.assign("/");
 }
}

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
      <Container>
          <Navbar.Brand href="/home">
            <img
              alt="groupomania logo"
              src="./images/icon-nav.png"
              height="40"
              className="d-inline-block align-center"
            />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/home">News</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
