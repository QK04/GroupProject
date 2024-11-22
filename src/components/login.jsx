import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure your CSS is linked

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the `onLogin` function passed as a prop
    onLogin(username, password);

    // Redirect to the homepage if login is successful
    if (username === 'admin' && password === '123') {
      navigate('/'); // Redirect to the home page
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input 
          className='login-input'
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
          className='login-input'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
