import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css'; 
import axios from 'axios';
import usthLogo from '../assets/usthlogo.png';
import styled from '@emotion/styled';

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [role, setRole] = useState("Student"); // Default to "Student"
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (password !== re_password) {
            setError("Passwords do not match");
            return;
        }

        if (!email || !username || !password) {
            setError("All fields are required");
            return;
        }

        setLoading(true); // Set loading state
        setError(""); // Clear previous errors

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/register`,
                {
                    email: email,
                    user_name: username,
                    password: password,
                    role: role,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true); // Registration successful
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/login");
                }, 3000); // Redirect after 3 seconds
            } else {
                setError(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Logo Section */}
                <div className="header">
                    <img
                        src={usthLogo}
                        className='register-logo'
                        alt="Logo-Truong-Dai-hoc-Khoa-hoc-va-Cong-nghe-Ha-Noi"
                    />
                </div>

                {/* Form Section */}
                <div className="register-container-form">
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        {/* Email Input */}
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Username Input */}
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Re-enter Password */}
                        <div className="form-group">
                            <input
                                type="password"
                                id="re-password"
                                name="re-password"
                                placeholder="Re-enter your password"
                                value={re_password}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="form-group">
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <input
                            type="submit"
                            value={loading ? "Registering..." : "Register"}
                            disabled={loading}
                        />
                    </form>

                    {/* Link to Login */}
                    <div className="register">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>

            {/* Error Pop-Up */}
            {error && <div className="error-pop-up">{error}</div>}

            {/* Success Pop-Up */}
            {success && (
                <div className="success-pop-up">
                    <p>You have successfully registered!</p>
                </div>
            )}
        </div>
    );
}

export default Register;
