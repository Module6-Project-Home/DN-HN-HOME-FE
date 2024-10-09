import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('username') || null); // Khôi phục user từ localStorage
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    }); // Khôi phục roles từ localStorage

    // Hàm login, lưu username và roles vào state và localStorage
    const login = (username, roles) => {
        // Kiểm tra nếu user và roles đã được thiết lập, tránh gọi setState liên tục
        if (user !== username || JSON.stringify(roles) !== JSON.stringify(roles)) {
            setUser(username);
            localStorage.setItem('username', username);
            setRoles(roles);
            localStorage.setItem('roles', JSON.stringify(roles));
        }
    };

    // Hàm logout, xóa dữ liệu user và roles từ state và localStorage
    const logout = () => {
        setUser(null);
        setRoles([]);
        localStorage.removeItem('jwtToken'); // Xóa token khi đăng xuất
        localStorage.removeItem('username');
        localStorage.removeItem('roles'); // Xóa vai trò khi đăng xuất
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để truy cập vào AuthContext
export const useAuth = () => useContext(AuthContext);
