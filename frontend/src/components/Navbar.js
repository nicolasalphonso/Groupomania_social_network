import React from "react";
//import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const NavigationBar = () => {
function handleLogout() {
 if( window.confirm("Do you really want to log out !")) {
  localStorage.removeItem("ReponseServeur");
 }
}

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
      <Container>
        <Nav.Link href="/home">
          <Navbar.Brand>
            <img
              alt="groupomania logo"
              src="./images/icon-nav.png"
              height="40"
              className="d-inline-block align-center"
            />
          </Navbar.Brand>
        </Nav.Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="/home">News</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/" onClick={() => handleLogout()}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
