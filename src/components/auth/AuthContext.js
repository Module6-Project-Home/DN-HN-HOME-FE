import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('username') || null); // Khôi phục user từ localStorage
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    }); // Khôi phục roles từ localStorage
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null); // Khôi phục token từ localStorage

    // Hàm login, lưu username, roles, và token vào state và localStorage
    const login = (username, roles, token) => {
        setUser(username);
        localStorage.setItem('username', username);

        setRoles(roles);
        localStorage.setItem('roles', JSON.stringify(roles));

        setToken(token);
        localStorage.setItem('jwtToken', token); // Lưu token vào localStorage
    };

    // Hàm logout, xóa dữ liệu user, roles, và token từ state và localStorage
    const logout = () => {
        setUser(null);
        setRoles([]);
        setToken(null);

        localStorage.removeItem('jwtToken'); // Xóa token khi đăng xuất
        localStorage.removeItem('username');
        localStorage.removeItem('roles'); // Xóa vai trò khi đăng xuất
    };

    // Kiểm tra token khi component được mount
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            console.log('Token found:', storedToken);
            // Có thể kiểm tra token với API ở đây nếu cần
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, roles, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để truy cập vào AuthContext
export const useAuth = () => useContext(AuthContext);
