import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { Dropdown } from 'bootstrap';

let dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
let dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
    return new Dropdown(dropdownToggleEl);
});

const Header = () => {
    const { user, logout, login } = useAuth(); // Sử dụng user thay vì username
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRoles = localStorage.getItem('roles');

        if (storedUsername && storedRoles) {
            try {
                login(storedUsername, JSON.parse(storedRoles)); // Parse lại roles từ JSON nếu nó tồn tại
            } catch (error) {
                console.error('Error parsing roles from localStorage:', error);
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout');
            logout(); // Clear username in context
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="container-fluid fixed-top">
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <Link to="/home" className="navbar-brand">
                        <h1 className="text-primary display-6">3 NKQ Homestay</h1>
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <Link to="/home" className="nav-item nav-link active">Trang chủ</Link>
                            <Link to="/property" className="nav-item nav-link">Homestay</Link>
                            <Link to="/home/about" className="nav-item nav-link">Về chúng tôi</Link>
                        </div>
                        <div className="d-flex m-3 me-0">
                            <div className="dropdown my-auto">
                                <a className="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fas fa-user fa-2x"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-1" aria-labelledby="dropdownMenuLink" style={{ minWidth: '300px' }}>
                                    {user ? (
                                        <>
                                            <li className="text-center my-3">
                                                <span className="font-weight-bold">{`Chào mừng, ${user}!`}</span>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/home/detail_user/1">Quản lý tài khoản</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/property/history">Lịch sử thuê nhà</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/property">Danh sách nhà cho thuê</Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;