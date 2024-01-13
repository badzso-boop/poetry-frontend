// src/components/Login.js

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

import BadgeAlert from './BadgeAlert';

const Login = () => {
  const { setUser, setUserId } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [loginText, setLoginText] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        username: username,
        password: password,
      };

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres bejelentkezés, kezelheted a választ itt
        const responseData = await response.json();
        const userId = responseData.userId;
        setUser({ username: username });
        setUserId(userId)
        console.log('Successful login');
        setLoginSuccess(true)
        setLoginText("Sikeres bejelentkezés")

        navigate('/poems');
      } else {
        // Sikertelen bejelentkezés, kezelheted a választ itt
        console.error('Login failed');
        setLoginSuccess(false)
        setLoginText("Sikertelen bejelentkezés")
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
          Login
        </button>
      </form>

      {loginSuccess !== null && (
        <BadgeAlert
          success={loginSuccess}
          text={loginText}
        />
      )}
    </div>
  );
};

export default Login;
