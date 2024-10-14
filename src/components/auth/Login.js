import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem('authMessage') || localStorage.getItem('loginMessage');
        if (message) {
            setLoginMessage(message);
            localStorage.removeItem('authMessage');
            localStorage.removeItem('loginMessage');
        }

        // Handle Google login callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            handleGoogleCallback(token);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Validate input fields
        if (!username || !password) {
            setError('Vui lòng nhập tên người dùng và mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/login', { username, password });
            const { id, token, authorities } = response.data;
            const roles = authorities.map(auth => auth.authority);

            // Store token and user information
            storeUserData(token, username, id, roles);
            redirectUser(roles);
        } catch (error) {
            console.error(error);
            setError('Tài khoản hoặc mật khẩu không đúng');
            localStorage.setItem('loginMessage', 'Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    const storeUserData = (token, username, id, roles) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', id);
        localStorage.setItem('roles', JSON.stringify(roles));
        login(username, roles, id, token);
        setPassword('');
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/v1/SSO/google';
    };

    const handleGoogleCallback = async (token) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/google-login?token=${token}`);
            const { id, username, authorities } = response.data;
            const roles = authorities.map(auth => auth.authority);

            storeUserData(token, username, id, roles);
            redirectUser(roles);
        } catch (error) {
            console.error('Error during Google login:', error);
            setError('Lỗi đăng nhập Google');
        }
    };

    const redirectUser = (roles) => {
        if (roles.includes('ROLE_HOST')) {
            navigate('/host/listMyHome');
        } else if (roles.includes('ROLE_ADMIN')) {
            console.log("test")
            navigate('/admin/dashboard');
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleLogin} className="p-4 border rounded shadow">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                {loginMessage && <div className="alert alert-danger">{loginMessage}</div>}
                {error && <p className="text-danger text-center">{error}</p>}
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
                            setError('');
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
                            setError('');
                        }}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : 'Đăng Nhập'}
                </button>
                <hr />
                <button type="button" className="btn btn-danger w-100" onClick={handleGoogleLogin}>
                    Đăng Nhập bằng Google
                </button>
            </form>
        </div>
    );
};

export default Login;
