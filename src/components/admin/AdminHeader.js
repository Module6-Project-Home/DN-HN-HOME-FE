import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px' }}>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <h1>Admin Dashboard</h1>
                <nav>
                    <Link to="/admin" style={{ color: '#fff', marginRight: '15px' }}>Dashboard</Link>
                    <Link to="/admin/users" style={{ color: '#fff', marginRight: '15px' }}>Users</Link>
                    <Link to="/admin/settings" style={{ color: '#fff' }}>Settings</Link>
                </nav>
            </div>
        </header>
    );
};

export default AdminHeader;
