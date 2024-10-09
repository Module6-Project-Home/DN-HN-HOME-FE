import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext

const Login = () => {
    const { login } = useAuth(); // Access login function from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const [loginMessage, setLoginMessage] = useState(''); // State for login message
    const navigate = useNavigate();

    // Retrieve message from local storage and clear it
    useEffect(() => {
        const message = localStorage.getItem('authMessage') || localStorage.getItem('loginMessage');
        if (message) {
            setLoginMessage(message); // Set login message from local storage
            localStorage.removeItem('authMessage'); // Clear the message after displaying it
            localStorage.removeItem('loginMessage'); // Clear login-specific messages too
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error message

        // Simple validation
        if (!username || !password) {
            setError('Vui lòng nhập tên người dùng và mật khẩu');
            return;
        }

        setLoading(true); // Set loading to true

        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                username,
                password,
            });

            const { token, authorities } = response.data; // Get authorities from the response
            const roles = authorities.map((auth) => auth.authority); // Extract roles

            // Save data to local storage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('username', username);
            localStorage.setItem('roles', JSON.stringify(roles)); // Store roles

            // Call login from context
            login(username, roles);
            setPassword(''); // Clear password after successful login

            // Redirect based on role
            if (roles.includes('ROLE_HOST')) {
                navigate('/host/dashboard');
            } else if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            // Display error message
            setError('Tài khoản hoặc mật khẩu không đúng');
            // Optionally, you can set a login message to local storage for future notifications
            localStorage.setItem('loginMessage', 'Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false); // Set loading to false after the request
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleLogin} className="p-4 border rounded shadow">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                {loginMessage && <div className="alert alert-danger">{loginMessage}</div>} {/* Display login message */ }
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên người dùng</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Tên người dùng"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(''); // Clear error when user starts typing
                        }}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(''); // Clear error when user starts typing
                        }}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'} {/* Change button text when loading */ }
                </button>
                {error && <p className="text-danger text-center mt-2">{error}</p>} {/* Display error message */ }
            </form>
        </div>
    );
};

export default Login;
