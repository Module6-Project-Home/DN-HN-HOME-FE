import React from 'react';
import AdminHeader from './AdminHeader'; // Import header
// import AdminFooter from './AdminFooter'; // Import footer

const AdminLayout = ({ children }) => {
    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AdminHeader /> {/* Header for Admin pages */}
            <div style={{ flex: '1' }}> {/* Main content area */}
                {children}
            </div>
            {/*<AdminFooter /> /!* Footer for Admin pages *!/*/}
        </div>
    );
};

export default AdminLayout;
