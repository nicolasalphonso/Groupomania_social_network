import React from "react";
import Log from "../components/Log";
import loginImage from "../images/login.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Loginsubscribe = () => {
  return (
    <div className="loginPage">
      <Container>
        <Row>
          <Col xs={7}>
            <Log />
          </Col>
          <Col xs={5}>
              <img src={loginImage} alt="connexion et enregistrement" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Loginsubscribe;
