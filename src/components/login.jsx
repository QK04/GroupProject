import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Clear any previous error message

    try {
      // Call the login API
      const response = await axios.post(
        'https://xds4mfuxv4.execute-api.us-east-1.amazonaws.com/prod/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response to see what's being returned
      console.log("API Response:", response);

      // If login is successful, call onLogin (you can pass additional user info if needed)
      if (response.status >= 200 && response.status < 300) {
        const user = JSON.parse(response.data.body);
        console.log("User Data from API:", user);

        onLogin(user); // Pass user data to the parent component

        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Log the user role to check if it's being properly returned
        const role = user.role;
        console.log("User Role:", role);
        console.log("Role Type:", typeof role);

        if (role) {
          const trimmedRole = role.trim(); // Remove spaces if any
          console.log("Trimmed User Role:", trimmedRole);
  
          // Check role and navigate accordingly
          if (trimmedRole === 'Student') {
            console.log("Redirecting to Student Dashboard...");
            navigate('/student-dashboard');
          } else if (trimmedRole === 'Teacher') {
            console.log("Redirecting to Teacher Dashboard...");
            navigate('/teacher-dashboard');
          } else {
            console.error("Unknown role:", trimmedRole); // Log error if role is not found
            setError('Unknown role');
          }
        } else {
          console.error("Role is missing or invalid");
          setError('Role is missing or invalid');
        }
      } else {
        console.error("Login failed with status:", response.status);
        setError('Invalid credentials or something went wrong');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError('Invalid credentials or something went wrong');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            className='login-input'
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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

      {error && <div className="error-message">{error}</div>}
      
      <div className="register-link">
        <p>New to the platform?</p>
        <button className="register-button" onClick={handleRegister}>Create an Account</button>
      </div>
    </div>
  );
};

export default Login;
