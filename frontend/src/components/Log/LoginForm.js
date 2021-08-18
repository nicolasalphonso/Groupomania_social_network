import React from "react";
import { useState } from "react";

/** functional component that allows user to login */
const LoginForm = () => {
  /*
  local states :
  email : email entered
  password : password entered
  */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // dom element that will show the errors
  const loginError = document.getElementById("loginError");

  /** function to handle login
   * prepares the fetch and analyses the response
   * 
   * @param {*} e : event
   */
  const handleLogin = (e) => {
    let donnees = {
        email: email.toLowerCase(),
        password: password
    };
      e.preventDefault();

      fetch("http://localhost:7000/api/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(donnees),
      })
      .then((response) => response.json())
      .then((resultat) => {
        localStorage.setItem("ReponseServeur", JSON.stringify(resultat));
        if(resultat.error) {
            loginError.innerHTML = resultat.error;
        } else {
            window.location='/home';
        }
      })
      .catch((error) => {
        console.error("Erreur de fetch POST:", error);
      });
  };

  return (
    <form action="" onSubmit={handleLogin} id="registerForm">
      <h1>Login</h1>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        autoComplete="email"
        required="required"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="current-password"
        required="required"
      />
      <input type="submit" value="login" />
      <div id="loginError"></div>
    </form>
  );
};

export default LoginForm;