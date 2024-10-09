import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);

    // Hàm login, lưu username và roles vào state và localStorage
    const login = (username, roles) => {
        setUser(username);
        localStorage.setItem('username', username);
        setRoles(roles);
        localStorage.setItem('roles', JSON.stringify(roles)); // Lưu vai trò dưới dạng chuỗi JSON
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
