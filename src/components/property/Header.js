import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { Dropdown } from 'react-bootstrap';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeroBanner.css'

const Header = () => {
    const { user, roles, logout, login } = useAuth();
    const navigate = useNavigate();

    const handleUpgradeRequest = async () => {
        if (!user || !user.id) {
            console.error('User is not defined or user ID is missing.');
            toast.error('Bạn cần đăng nhập để thực hiện yêu cầu này.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.put('http://localhost:8080/api/users/request-upgrade', null, {
                params: { userId: user.id },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                toast.success('Yêu cầu nâng cấp của bạn đã được gửi thành công!');
                navigate('/success-page');
            }
        } catch (error) {
            console.error('Error sending upgrade request:', error.response ? error.response.data : error.message);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRoles = localStorage.getItem('roles');
        const storedUserId = localStorage.getItem('userId');

        if (storedUsername && storedRoles && !user) {
            try {
                login(storedUsername, JSON.parse(storedRoles), storedUserId);
            } catch (error) {
                console.error('Error parsing roles from localStorage:', error);
            }
        }
    }, [login, user]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            logout();
            toast.success('Đăng xuất thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            toast.error('Đăng xuất không thành công.');
        }
    };

    const renderDropdownMenu = () => {
        if (!user) {
            return (
                <>
                    <li>
                        <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                    </li>
                    <li>
                        <Link to="/register" className="dropdown-item">Đăng ký</Link>
                    </li>
                </>
            );
        }

        // Check if roles is an array
        const userRoles = Array.isArray(roles) ? roles : [];

        // Admin Menu
        if (userRoles.includes('ROLE_ADMIN')) {
            return (
                <>
                    <li className="text-center my-3">
                        <span className="font-weight-bold">{`Chào mừng, ${user.username}!`}</span>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/admin/dashboard">Trang quản trị</Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/admin/property">Danh sách nhà cho thuê</Link>
                    </li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                    </li>
                </>
            );
        }

        // Host Menu
        if (userRoles.includes('ROLE_HOST')) {
            return (
                <>
                    <li className="text-center my-3">
                        <span className="font-weight-bold">{`Chào mừng, ${user.username}!`}</span>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/user/view-profile">Quản lý tài khoản</Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/host/dashboard">Quản lý Homestay</Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/user/history-booking">Lịch sử thuê nhà</Link>
                    </li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                    </li>
                </>
            );
        }

        // Regular User Menu
        if (!userRoles.includes('ROLE_ADMIN') && !userRoles.includes('ROLE_HOST')) {
            return (
                <>
                    <li className="text-center my-3">
                        <span className="font-weight-bold">{`Chào mừng, ${user.username}!`}</span>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/user/view-profile">Quản lý tài khoản</Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="/user/history-booking">Lịch sử thuê nhà</Link>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={handleUpgradeRequest}>
                            Trở thành chủ nhà
                        </button>
                    </li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                    </li>
                </>
            );
        }
    };

    return (
        <div className="container-fluid fixed-top">
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <Link to="/home" className="navbar-brand">
                        <h1 className="text-primary display-6">3NKQ Homestay</h1>
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <Link to="/home" className="nav-item nav-link active">Trang chủ</Link>
                            <Link to="/property" className="nav-item nav-link">Homestay</Link>
                            <Link to="/home/about" className="nav-item nav-link">Về chúng tôi</Link>
                        </div>
                        <div className="d-flex m-3 me-0">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdownMenuLink" variant="link" className="nav-link">
                                    <i className="fas fa-user fa-2x"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" style={{ minWidth: '300px' }}>
                                    {renderDropdownMenu()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </nav>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Header;