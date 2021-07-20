import React, { useState } from "react";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // prevent page reloading
  const handleRegister = (e) => {
      let donnees = {
          email: email,
          password: password
      };

      e.preventDefault();
      
  };

  return (
    <form action="" onSubmit={handleRegister} id="registerForm">
      <h1>Register</h1>
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
      <input type="submit" value="register" />
    </form>
  );
};

export default RegisterForm;
