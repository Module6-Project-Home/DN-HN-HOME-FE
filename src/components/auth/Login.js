import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const message = localStorage.getItem('authMessage') || localStorage.getItem('loginMessage');
        if (message) {
            setLoginMessage(message);
            localStorage.removeItem('authMessage');
            localStorage.removeItem('loginMessage');
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
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

            login(username, roles, id, token);
            setPassword('');

            if (roles.includes('ROLE_HOST')) {
                navigate('/host/dashboard');
            } else if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                setError('Tài khoản đang bị khoá');
                localStorage.setItem('loginMessage', 'Tài khoản đang bị khoá');
            } else {
                setError('Tài khoản hoặc mật khẩu không đúng');
                localStorage.setItem('loginMessage', 'Tài khoản hoặc mật khẩu không đúng');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/v1/SSO/google';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <MDBContainer fluid className='my-5'>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol col='6' style={{ backgroundImage: 'url(https://luxurydanang.muongthanh.com/images/login-banner.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}></MDBCol>
                <MDBCol col='6'>
                    <MDBCard className='cascading-left' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)', marginTop: '-50px' }}>
                        <MDBCardBody className='p-5 shadow-5 text-center'>
                            <Link to="/home">
                                <img
                                    src="https://img3.thuthuatphanmem.vn/uploads/2019/09/30/hinh-tron-dep_111539274.jpg"
                                    alt="THUÊ TRỌ LUXURY Logo"
                                    style={{ width: '200px', cursor: 'pointer' }}
                                />
                            </Link>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="text-left mb-2">
                                <label htmlFor='username'>Tên tài khoản</label>
                            </div>
                            <MDBInput
                                wrapperClass='mb-4'
                                id='username'
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="text-left mb-2">
                                <label htmlFor='password'>Mật khẩu</label>
                            </div>
                            <MDBInput
                                wrapperClass='mb-4'
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="btn btn-primary w-100" type="button" onClick={handleLogin}>Đăng nhập</button>
                            <div className="text-center">
                                <p>hoặc đăng nhập bằng:</p>
                                {/* Increase button size */}
                                <MDBBtn onClick={handleGoogleLogin} tag='a' color='none' className='mx-3 btn-lg' style={{ color: '#1266f1', padding: '10px 20px' }}>
                                    <MDBIcon fab icon='google' size="lg" />
                                </MDBBtn>
                            </div>
                            <div className="mt-3 text-center">
                                <p>
                                    Bạn chưa có tài khoản?
                                    <button onClick={handleRegister} color='primary' className='btn btn-primary ms-2'>
                                        Tạo tài khoản mới
                                    </button>
                                </p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default Login;
