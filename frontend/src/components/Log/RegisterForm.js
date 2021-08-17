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
    if (password === ctrlPassword) {
      let donnees = {
        email: email.toLowerCase(),
        password: password,
        firstname: firstname.toLowerCase(),
        lastname: lastname.toLowerCase(),
        username: username.toLowerCase(),
        ctrlPassword: ctrlPassword,
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
          if (resultat.error) {
            registerError.innerHTML = resultat.error;
          } else {
            window.location = "/";
          }
        })
        .catch((error) => {
          console.error("Erreur de fetch POST:", error);
        });
    }
    else {
      document.getElementById("registerError").innerHTML = "Les mots de passe ne correspondent pas";
      e.preventDefault();
    }
  };

  return (
    <form action="" onSubmit={handleRegister} id="registerForm">
      <h1>Register</h1>
      <span className="fillingNotes">
        <sup>* </sup> = required
      </span>
      <br />
      <label htmlFor="firstname">Firstname</label>
      <sup> *</sup>
      <br />
      <span className="fillingNotes">
        Firstname : only letters up to 30 characters
      </span>
      <input
        type="text"
        name="firstname"
        id="firstname"
        onChange={(e) => setFirstname(e.target.value)}
        value={firstname}
        pattern="[A-Za-z ]+{1,30}"
        title="Firstname should contain only letters. Length is limited to 30 characters"
        required="required"
      />
      <label htmlFor="lastname">Lastname</label>
      <sup> *</sup>
      <br />
      <span className="fillingNotes">
        lastname : only letters up to 30 characters, no space
      </span>
      <input
        type="text"
        name="lastname"
        id="lastname"
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
        pattern="[A-Za-z ]+{1,30}"
        title="Lastname should contain only letters. Length is limited to 30 characters"
        required="required"
      />
      <label htmlFor="username">Username</label>
      <sup> *</sup>
      <br />
      <span className="fillingNotes">
        username : only lowercase up to 20 characters
      </span>
      <input
        type="text"
        name="username"
        id="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        pattern="[a-z]{1,20}"
        title="Username should contain only letters. Length is limited to 20 characters"
        autoComplete="username"
        required="required"
      />
      <label htmlFor="email">Email</label>
      <sup> *</sup>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required="required"
      />
      <label htmlFor="password">Password</label>
      <sup> *</sup>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required="required"
        autoComplete="new-password"
      />
      <label htmlFor="ctrlPassword">Confirm password</label>
      <sup> *</sup>
      <input
        type="password"
        name="ctrlPassword"
        id="ctrlPassword"
        onChange={(e) => setCtrlPassword(e.target.value)}
        value={ctrlPassword}
        required="required"
        autoComplete="new-password"
      />
      <input type="submit" value="register" />
      <div id="registerError"></div>
    </form>
  );
};

export default RegisterForm;
