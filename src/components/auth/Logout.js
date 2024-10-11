import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const LogoutButton = () => {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('jwtToken'); // Use the correct token name
        // Chuyển hướng về trang đăng nhập
        navigate('/login'); // Use navigate to redirect to the login page
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
    );
};

export default LogoutButton; // Ensure the component is exported
