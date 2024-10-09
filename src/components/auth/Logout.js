import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
    const history = useHistory();

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token'); // Giả sử bạn lưu token dưới tên 'token'
        // Chuyển hướng về trang đăng nhập
        history.push('/login'); // Đường dẫn đến trang đăng nhập
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
    );
};

export default LogoutButton;
