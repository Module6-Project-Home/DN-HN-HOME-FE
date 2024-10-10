import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext

const Login = () => {
    const { login } = useAuth(); // Access login function from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear previous error message
        setError('');

        // Simple validation
        if (!username || !password) {
            setError('Vui lòng nhập tên người dùng và mật khẩu');
            return;
        }

        setLoading(true); // Set loading to true

        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                username,
                password
            });

            const { token, authorities } = response.data; // Lấy authorities từ phản hồi
            console.log("token: "+ token);
            const roles = authorities.map(auth => auth.authority); // Trích xuất vai trò

            localStorage.setItem('jwtToken', token ); // Save JWT token in local storage
            localStorage.setItem('username', username);
            localStorage.setItem('roles', JSON.stringify(roles)); // Lưu vai trò vào local storage
            login(username, roles); // Call login from context
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
            console.log(error);
            // You may want to inspect error.response to handle specific cases
            setError('Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false); // Set loading to false after the request
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleLogin} className="p-4 border rounded shadow">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
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
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'} {/* Change button text when loading */}
                </button>
                {error && <p className="text-danger text-center mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
