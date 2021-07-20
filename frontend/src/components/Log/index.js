import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Log = () => {
  // we use local states to know if the user chooses to connect or register
  // default is that we try to login
  const [loginModal, setLoginModal] = useState(true);
  const [registerModal, setRegisterModal] = useState(false);

  // this manages the modal associated with register and login
  const handleModals = (e) => {
    if (e.target.id === "login") {
      setRegisterModal(false);
      setLoginModal(true);
    } else if (e.target.id === "register") {
      setRegisterModal(true);
      setLoginModal(false);
    }
  };

  // a click on a list item calls handlModals
  // if the user clicks on register or login, the right form appears
  return (
    <div className="loginForm">
      <div className="container">
        <Row>
        <Col xs={4}>
        <ul>
          <li
            onClick={handleModals}
            id="register"
            className={registerModal ? "active-btn" : null}
          >
            Register
          </li>
          <li
            onClick={handleModals}
            id="login"
            className={loginModal ? "active-btn" : null}
          >
            Login
          </li>
        </ul>
        </Col>
        <Col xs={8}>
        {loginModal && <LoginForm />}
        {registerModal && <RegisterForm />}
        </Col>
        </Row>
      </div>
    </div>
  );
};

export default Log;
