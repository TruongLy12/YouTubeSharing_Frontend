import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css'; 

const LOGIN_URL = "https://bold-astrix-formyownpersonal.koyeb.app/api/auth/login";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Ensure password field is not empty
        if (!password.trim()) {
            setError('Password cannot be empty');
            return;
        }

        try {
            // Send data to api backend
            const response = await axios.post(
                LOGIN_URL,
                { username, password },
                {
                    headers: { 
                        'Accept': 'application/json',
                        "Content-Type": "application/json" 
                    }
                }
            );
            
            // If success
            if (response.status === 200) {
                // Save token, email upon successful login
                login(username);
                
                // Redirect to home page
                navigate('/home');
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            setError('Error happen: ' + error + '. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>

            {error && (
                <p className="error-message">Error: {error}</p>
            )}

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
