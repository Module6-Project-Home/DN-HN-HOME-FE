import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from "./auth/AuthContext";
// Import hook để sử dụng context

const PrivateRoute = ({ element, requiredRole }) => {
    const { user, roles } = useAuth(); // Lấy thông tin từ AuthContext
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setMessage('Bạn cần đăng nhập để truy cập trang này.');
            setIsAuthorized(false);
        } else if (requiredRole && !roles.includes(requiredRole)) {
            setMessage('Bạn không có quyền truy cập trang này.');
            setIsAuthorized(false);
        }
    }, [roles, requiredRole]);

    if (!isAuthorized) {
        return <Navigate to="/login" state={{ message }} />;
    }

    return <>{element}</>; // Render the component if authorized
};

export default PrivateRoute;
