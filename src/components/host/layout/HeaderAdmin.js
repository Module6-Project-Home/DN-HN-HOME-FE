import React from 'react';
import './AdminStyle.css';
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const HeaderAdmin = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            // Gọi hàm logout
            logout();

            // Hiển thị thông báo thành công
            toast.success('Đăng xuất thành công!');

            // Chuyển hướng về trang đăng nhập sau khi đăng xuất
            setTimeout(() => {
                navigate('/login');
            }, 1000);  // Chờ 1 giây để toast hiển thị trước khi điều hướng
        } catch (error) {
            console.error('Logout failed', error);

            // Hiển thị thông báo lỗi
            toast.error('Đăng xuất không thành công.');
        }
    };

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark   ">


            {/* Navbar Brand */}
            <Link className="navbar-brand ps-3" to="/home">3NKQ Homestay</Link>

            {/* Sidebar Toggle */}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
                <i className="fas fa-bars"></i>
            </button>

            {/* Navbar */}

            <ul className="navbar-nav ms-auto me-3"> {/* Thêm ms-auto để căn về bên phải */}
                <li className="nav-item">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            <i className="fas fa-user fa-fw"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/user/view-profile">Quản lý tài khoản</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/user/history-booking">Lịch sử thuê nhà</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as="button">
                                <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </li>
            </ul>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </nav>
    );
};

export default HeaderAdmin;
