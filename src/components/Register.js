// src/components/Register.js

import React, { useState } from 'react';

import BadgeAlert from './BadgeAlert';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [registrationText, setRegistrationText] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        username: username,
        email: email,
        password: password,
      };

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres regisztráció, kezelheted a választ itt
        console.log('Successful registration');
        setRegistrationSuccess(true);
        setRegistrationText("Sikeres regisztráció")
      } else {
        // Sikertelen regisztráció, kezelheted a választ itt
        console.error('Registration failed');
        const responseData = await response.json();
        setRegistrationSuccess(false);
        setRegistrationText(responseData.errorMessage); 
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>

      {registrationSuccess !== null && (
        <BadgeAlert
          success={registrationSuccess}
          text={registrationText}
        />
      )}
    </div>
  );
};

export default Register;