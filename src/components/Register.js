import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; 

const REGISTER_URL = "https://bold-astrix-formyownpersonal.koyeb.app/api/auth/register";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRegister = async (e) => {
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
                REGISTER_URL,
                { username, password },
                {
                    headers: { 
                        'Accept': 'application/json',
                        "Content-Type": "application/json" 
                    }
                }
            );
            
            if (response.status === 201) {
                setRegistrationSuccess(true);
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            setError('Error happen: ' + error + '. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register Page</h2>

            {registrationSuccess && (
                <div>
                <p>Registration successful!</p>
                <p>Click <a href="/login">here</a> to login.</p>
                </div>
            )}
            {error && (
                <p className="error-message">Error: {error}</p>
            )}

            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>

        </div>
    );
};

export default Register;
