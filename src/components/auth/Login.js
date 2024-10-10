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
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Vui lòng nhập tên người dùng và mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/login', { username, password });
            const { id, token, authorities } = response.data;
            const roles = authorities.map(auth => auth.authority);

            // Lưu trữ token và thông tin người dùng
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', id);
            localStorage.setItem('roles', JSON.stringify(roles));

            // Gọi hàm login từ AuthContext với đầy đủ thông tin
            login(username, roles, id);

            setPassword('');

            // Điều hướng dựa trên vai trò
            if (roles.includes('ROLE_HOST')) {
                navigate('/host/dashboard');
            } else if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            setError('Tài khoản hoặc mật khẩu không đúng');
            localStorage.setItem('loginMessage', 'Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleLogin} className="p-4 border rounded shadow">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                {loginMessage && <div className="alert alert-danger">{loginMessage}</div>}
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
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
                {error && <p className="text-danger text-center mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
