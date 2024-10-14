import React, { createContext, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    });
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null);

    const login = (username, roles, userId, token) => {
        console.log('Logging in:', { username, roles, userId });
        setUser({ id: userId, username: username });
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        setRoles(roles);
        localStorage.setItem('roles', JSON.stringify(roles));

        setToken(token);
        localStorage.setItem('jwtToken', token); // Store token in localStorage
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        setToken(null); // Clear token state
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
    };

    return (
        <AuthContext.Provider value={{ user, roles, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
