import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "test@example.com") {
            navigate('/dashboard');
        } else {
            alert("Use test@example.com");
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Merchant Login</h1>
            <form data-test-id="login-form" onSubmit={handleLogin}>
                <input 
                    data-test-id="email-input" 
                    type="email" 
                    placeholder="test@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <br /><br />
                <input data-test-id="password-input" type="password" placeholder="Password" required />
                <br /><br />
                <button data-test-id="login-button" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;