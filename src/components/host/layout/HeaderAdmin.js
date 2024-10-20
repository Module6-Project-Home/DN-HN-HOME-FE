import React, { useState, useEffect } from 'react';
import './AdminStyle.css';
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import ChatNotification from "../../comunication/ChatNotification"; // Import CSS của react-toastify

const HeaderAdmin = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    // Lấy danh sách thông báo từ API
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/notification', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            toast.error('Không thể tải thông báo.');
        }
    };

    // Lọc và đếm thông báo chưa đọc
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    // Gọi API để đánh dấu một thông báo là đã đọc
    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.post(`http://localhost:8080/api/notification/markAsRead/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            fetchNotifications(); // Lấy lại thông báo sau khi cập nhật
        } catch (error) {
            console.error('Failed to mark notification as read', error);
            // toast.error('Không thể đánh dấu thông báo.');
        }
    };

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            logout(); // Gọi hàm logout từ context
            toast.success('Đăng xuất thành công!');
            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            console.error('Logout failed', error);
            toast.error('Đăng xuất không thành công.');
        }
    };

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand */}
            <Link className="navbar-brand ps-3" to="/home">Nhà Tốt</Link>

            {/* Sidebar Toggle */}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
                <i className="fas fa-bars"></i>
            </button>

            {/* Navbar Right Side */}
            <ul className="navbar-nav ms-auto me-3">
                {/* Bell Icon for Notifications */}
                <li className="nav-item">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="dark" id="dropdown-notifications">
                            <i className="fas fa-bell"></i>
                            {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {notifications.length === 0 ? (
                                <Dropdown.Item>Không có thông báo</Dropdown.Item>
                            ) : (
                                notifications.map(notification => (
                                    <Dropdown.Item
                                        key={notification.id}
                                        style={{ backgroundColor: notification.isRead ? 'white' : 'yellow' }}
                                        onClick={() => markNotificationAsRead(notification.id)}
                                    >
                                        {notification.message}

                                        {/*{notification.message} - {new Date(notification.timestamp).toLocaleString()}*/}
                                    </Dropdown.Item>
                                ))
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </li>

                {/* Chat Notification Component */}
                <li className="nav-item">
                    <ChatNotification />
                </li>

                {/* User Icon and Dropdown */}
                <li className="nav-item">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="dark" id="dropdown-user">
                            <i className="fas fa-user fa-fw"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/user/view-profile">Quản lý tài khoản</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/user/history-booking">Lịch sử thuê nhà</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as="button">
                                <button type="button" className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>

            {/* Toast Container for Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </nav>
    );
};

export default HeaderAdmin;
