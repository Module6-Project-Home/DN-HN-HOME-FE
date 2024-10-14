import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    });
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null);

    const login = (username, roles, userId,token) => {
        setUser({ id: userId, username: username });
        setToken(token);
        setRoles(roles);

        // Store token and user information
        localStorage.setItem('userId', userId);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('roles', JSON.stringify(roles));
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);