import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminStyle.css';

const SidebarAdmin = () => {

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu active">
                    <div className="nav">
                        <Link
                            to="/admin/users"
                        >
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Danh sách người dùng
                        </Link>
                    </div>
                    <div className="nav">
                        <Link
                            to="/admin/hosts"
                        >
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Doanh sách chủ nhà
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default SidebarAdmin;