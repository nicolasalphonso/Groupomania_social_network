import React, { useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ctrlPassword, setCtrlPassword] = useState("");

  const registerError = document.getElementById("registerError");

  // prevent page reloading
  const handleRegister = (e) => {
    let donnees = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      username: username,
      ctrlPassword: ctrlPassword

    };

    e.preventDefault();

    fetch("http://localhost:7000/api/auth/signup", {
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
            registerError.innerHTML = resultat.error;
        } else {
            window.location='/';
        }
      })
      .catch((error) => {
        console.error("Erreur de fetch POST:", error);
      });
  };

  return (
    <form action="" onSubmit={handleRegister} id="registerForm">
      <h1>Register</h1>
      <label htmlFor="Firstname">First name</label>
      <input
        type="text"
        name="firstname"
        id="firstname"
        onChange={(e) => setFirstname(e.target.value)}
        value={firstname}
      />
      <label htmlFor="Lastname">Last name</label>
      <input
        type="text"
        name="lastname"
        id="lastname"
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
      />
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
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
      <label htmlFor="ctrlPassword">Confirm password</label>
      <input
        type="password"
        name="ctrlPassword"
        id="ctrlPassword"
        onChange={(e) => setCtrlPassword(e.target.value)}
        value={ctrlPassword}
      />
      <input type="submit" value="register" />
      <div id="registerError"></div>
    </form>
  );
};

export default RegisterForm;
