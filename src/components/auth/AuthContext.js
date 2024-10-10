import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);

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
