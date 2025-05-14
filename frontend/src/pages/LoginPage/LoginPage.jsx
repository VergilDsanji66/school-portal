import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const roles = ['Student', 'Lecture', 'Admin']; // Updated roles

    const handleLogin = () => {
        if (!selectedRole) {
            alert('Please select a role');
            return;
        }

        // Here you would typically verify credentials first
        // For now, we'll just navigate based on role
        switch(selectedRole) {
            case 'Student':
                navigate('/Student', { state: { studentNo: username } });
                break;
            case 'Lecture':
                navigate('/Lecture', { state: { email: username } });
                break;
            case 'Admin':
                navigate('/Admin');
                break;
            default:
                alert('Invalid role selected');
        }
    };

    return (
        <div className='login-page'>
            <div className="login-container">
                <div className="logo">
                    
                    <h1>SP</h1>
                    <p>School Protal </p>
                </div>

                <div className="form">
                    <p>Username</p>
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Enter your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="inputs" 
                    />
                    <p>Password</p>
                    <input 
                        id="password" 
                        className="inputs" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                    />
                </div>

                <div className="roles-grid">
                    {roles.map((role) => (
                        <div 
                        key={role}
                        className={`roles-items ${selectedRole === role ? 'selected' : ''}`}
                        onClick={() => setSelectedRole(role)}
                        >
                            {role}
                        </div>
                    ))}
                </div>

                <button onClick={handleLogin}>Login</button>
                <p className="FPW">Forgot password?</p>
            </div>
        </div>
    );
};

export default LoginPage;