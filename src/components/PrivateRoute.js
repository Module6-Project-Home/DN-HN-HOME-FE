import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, requiredRole }) => {
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('jwtToken');
    const roles = JSON.parse(localStorage.getItem('roles')) || [];

    useEffect(() => {
        if (!token) {
            setMessage('Bạn cần đăng nhập để truy cập trang này.');
            localStorage.setItem('authMessage', 'Bạn cần đăng nhập để truy cập trang này.');
            setIsAuthorized(false);
        } else if (requiredRole && !roles.includes(requiredRole)) {
            setMessage('Bạn không có quyền truy cập trang này.');
            localStorage.setItem('authMessage', 'Bạn không có quyền truy cập trang này.');
            setIsAuthorized(false);
        }
    }, [token, roles, requiredRole]);

    // Redirect if not authorized
    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    return <>{element}</>; // Render the component if authorized
};

export default PrivateRoute;
