import React from "react";
//import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const NavigationBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light">
    <Container>
    <Navbar.Brand href="">
          <img
            alt="groupomania logo"
            src="./images/icon-nav.png"
            height="40"
            className="d-inline-block align-center"
          />
        </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      </Nav>
      <Nav>
      <Nav.Link href="">News</Nav.Link>
            <Nav.Link href="">Profile</Nav.Link>
            <Nav.Link href="">Logout</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    </Container>
  </Navbar>

  );
};

export default NavigationBar;
