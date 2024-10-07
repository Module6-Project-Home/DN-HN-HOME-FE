import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="container-fluid fixed-top">
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <Link to="/home" className="navbar-brand">
                        <h1 className="text-primary display-6">3 NKQ Homestay</h1>
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse">
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
                                <a  className="dropdown-toggle" role="button" id="dropdownMenuLink"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fas fa-user fa-2x"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-1" aria-labelledby="dropdownMenuLink" style={{ minWidth: '300px' }}>
                                    <li className="text-center my-3">
                                        <span>Tên người dùng</span>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/home/detail_user/1">
                                            Quản lý tài khoản
                                        </Link>
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
                                        <form method="get" action="/logout">
                                            <button type="submit" className="dropdown-item">Đăng xuất</button>
                                        </form>
                                    </li>
                                    <li>
                                        <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                                    </li>
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
