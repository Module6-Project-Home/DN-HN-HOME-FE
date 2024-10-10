import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('username') || null); // Khôi phục user từ localStorage
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    }); // Khôi phục roles từ localStorage
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null); // Khôi phục token từ localStorage

<<<<<<< HEAD
    const login = (username, roles, userId) => {
        console.log('Logging in:', { username, roles, userId });
        setUser({ id: userId, username: username });
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        setRoles(roles);
        localStorage.setItem('roles', JSON.stringify(roles));
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        localStorage.removeItem('jwtToken');
=======
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
>>>>>>> 2b55b7c9825d5e810da83984156ea1b6679fcaac
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
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

export const useAuth = () => useContext(AuthContext);
