import React from 'react';
import { Link } from 'react-router-dom';
import './AdminStyle.css'

const SidebarAdmin = () => {
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <Link className="nav-link" to="/admin">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Tổng quan
                        </Link>
                    </div>
                    <div className="nav">
                        <Link className="nav-link" to="/admin/property">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Nhà
                        </Link>
                    </div>
                    <div className="nav">
                        <Link className="nav-link" to="/admin">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Đặt nhà
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default SidebarAdmin;
