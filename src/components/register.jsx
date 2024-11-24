import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [role, setRole] = useState("Student"); 
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (password !== re_password) {
            setError("Passwords do not match");
            return;
        }

        if (!email || !username || !password) {
            setError("All fields are required");
            return;
        }

        // Set loading state before sending request
        setLoading(true);
        setError(""); // Clear previous errors

        try {
            const response = await axios.post(
                'https://gkxigym921.execute-api.us-east-1.amazonaws.com/prod/register',
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

            console.log('Response:', response);

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/login");
                }, 3000);
            } else {
                setError(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false); // Stop loading state after request
        }
    };

    return (
        <div className='register-page'>
            <div className='register-container'>
                <div className="header">
                    <img
                        src="/src/assets/logo.png"
                        alt="Logo-Truong-Dai-hoc-Khoa-hoc-va-Cong-nghe-Ha-Noi"
                    />
                </div>
                <div className="register-container-form">
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required=""
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required=""
                                placeholder='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required=""
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="re-password"
                                name="re-password"
                                required=""
                                placeholder='Re-enter your password'
                                value={re_password}
                                onChange={(e) => setRePassword(e.target.value)}
                            />
                        </div>

                        {/* Role selection */}
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

                        <input type="submit" value={loading ? "Registering..." : "Register"} disabled={loading} />
                        <div className="register">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Display error message */}
            {error && <div className="error-pop-up">{error}</div>}

            {/* Display success message */}
            {success && (
                <div className="success-pop-up">
                    <p>You have successfully registered!</p>
                </div>
            )}
        </div>
    );
};

export default Register;
