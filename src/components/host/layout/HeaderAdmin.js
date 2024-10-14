import React from 'react';
import './AdminStyle.css';
import {Link} from "react-router-dom";

const HeaderAdmin = () => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand */}
            <Link className="navbar-brand ps-3" to="/home">QNK Homestay</Link>

            {/* Sidebar Toggle */}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
                <i className="fas fa-bars"></i>
            </button>

            {/* Navbar */}
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-user fa-fw"></i>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to="/user/detail">Lịch sử đặt nhà</Link></li>
                        <li><a className="dropdown-item" href="#!">Thông tin tài khoản</a></li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li><Link className="dropdown-item" to="/login">Đăng xuất</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default HeaderAdmin;
