import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../auth/AuthContext';
import {Dropdown} from 'react-bootstrap';
import {useEffect} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const {user, roles, logout, login} = useAuth();
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
                params: {userId: user.id},
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

            // Hiển thị thông báo trước khi logout
            toast.success('Đăng xuất thành công!');

            // Đảm bảo chờ một chút trước khi điều hướng để Toastify hiển thị
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 1500); // Chờ 1 giây trước khi điều hướng
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

        const userRoles = Array.isArray(roles) ? roles : [];

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
                        <hr className="dropdown-divider"/>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                    </li>
                </>
            );
        }

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
                    <hr className="dropdown-divider"/>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                </li>
            </>
        );
    };

    return (
        <div className="fixed-top">
            <nav className="navbar navbar-light navbar-expand-xl" style={{backgroundColor: '#3264ff'}}>
                <div className="container">
                    <Link to="/home" className="navbar-brand">
                        <img height="35" width="188" className="aw__ldrazpr"
                             src="https://static.chotot.com/storage/APP_WRAPPER/logo/pty-logo-appwrapper.png"
                             alt="Chợ Tốt"/>
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-white"></span> {/* Đổi màu biểu tượng thành trắng */}
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <Link to="/home" className="nav-item nav-link text-white active">Trang
                                chủ</Link> {/* Đổi màu chữ thành trắng */}
                            <Link to="/home/founders"
                                  className="nav-item nav-link text-white">Nhà Sáng Lập</Link> {/* Đổi màu chữ thành trắng */}
                            <Link to="/home/about" className="nav-item nav-link text-white">Về chúng
                                tôi</Link> {/* Đổi màu chữ thành trắng */}
                        </div>
                        <div className="d-flex m-3 me-0">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdownMenuLink" variant="link"
                                                 className="nav-link text-white"> {/* Đổi màu chữ thành trắng */}
                                    <i className="fas fa-user fa-2x text-white"></i> {/* Đổi màu biểu tượng thành trắng */}
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" style={{minWidth: '300px'}}>
                                    {renderDropdownMenu()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>
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
