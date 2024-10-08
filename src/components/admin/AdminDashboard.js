import React from 'react';
import AdminLayout from './AdminLayout'; // Import AdminLayout

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div>
                <h1 style={{ marginTop: '20px' }}>Admin Dashboard</h1> {/* Tăng khoảng cách xuống dưới */}
                {/* Nội dung trang Admin */}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;