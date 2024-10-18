import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize user state from localStorage, or set to null if not available
    const [user, setUser] = useState(() => {
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        return storedUsername && storedUserId
            ? { id: storedUserId, username: storedUsername }
            : null;
    });

    // Initialize roles and token from localStorage, or set default values
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        return storedRoles ? JSON.parse(storedRoles) : [];
    });
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null);

    // Login function to update the state and store data in localStorage
    const login = (username, roles, userId, token) => {
        setUser({ id: userId, username: username });
        setToken(token);
        setRoles(roles);

        // Store token and user information
        localStorage.setItem('userId', userId);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('roles', JSON.stringify(roles));
    };

    // Logout function to clear the state and remove data from localStorage
    const logout = () => {
        setUser(null);
        setRoles([]);
        setToken(null);


        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
    };

    // Automatically refresh user state from localStorage upon component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        const storedRoles = localStorage.getItem('roles');
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken && storedUsername && storedRoles) {
            setUser({ id: storedUserId, username: storedUsername });
            setToken(storedToken);
            setRoles(JSON.parse(storedRoles));
        }
    }, []);



    return (
        <AuthContext.Provider value={{ user, roles, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
