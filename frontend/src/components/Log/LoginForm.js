import React from "react";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginError = document.getElementById("loginError");

  const handleLogin = (e) => {
    let donnees = {
        email: email,
        password: password
    };
      e.preventDefault();
      console.log("ok");
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
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input type="submit" value="login" />
      <div id="loginError"></div>
    </form>
  );
};

export default LoginForm;
