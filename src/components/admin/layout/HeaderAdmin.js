import React, { useState, useEffect } from 'react';
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
    const [notifications, setNotifications] = useState([]);


    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            logout(); // Gọi hàm logout từ context
            toast.success('Đăng xuất thành công!');
            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            console.error('Logout failed', error);
            toast.error('Đăng xuất không thành công.');
        }
    };

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand */}
            <Link className="navbar-brand ps-3" to="/home">3NKQ Homestay</Link>

            {/* Sidebar Toggle */}
            <h1>ADMIN DASHBOARD</h1>

            {/* Toast Container for Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
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
