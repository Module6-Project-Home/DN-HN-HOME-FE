import React, { useState, useEffect } from 'react';
import './AdminStyle.css';
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Badge, Menu, Button } from 'antd';
import {BellOutlined, UserOutlined, LogoutOutlined, MenuOutlined} from '@ant-design/icons';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import ChatNotification from "../../comunication/ChatNotification";

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
            toast.error('Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.');
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
            toast.error('Không thể đánh dấu thông báo là đã đọc. Vui lòng thử lại.');
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
            toast.success('Đăng xuất thành công! Hẹn gặp lại bạn!');
            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            console.error('Logout failed', error);
            toast.error('Đăng xuất không thành công. Vui lòng thử lại.');
        }
    };

    const notificationMenu = (
        <Menu>
            {notifications.length === 0 ? (
                <Menu.Item>Hiện tại không có thông báo mới!</Menu.Item>
            ) : (
                notifications.map(notification => (
                    <Menu.Item
                        key={notification.id}
                        className={notification.isRead ? 'notification-read' : 'notification-unread'}
                        onClick={() => markNotificationAsRead(notification.id)}
                        style={{ marginBottom: '2px' }}
                    >
                        {notification.message} - {new Date(notification.timestamp).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </Menu.Item>
                ))
            )}
        </Menu>
    );

    const userMenu = (
        <Menu>
            <Menu.Item>
                <Link to="/user/view-profile" style={{ textDecoration: 'none' }}>Quản lý tài khoản</Link>
            </Menu.Item>
            <Menu.Item>
                <Link to="/user/history-booking" style={{ textDecoration: 'none' }}>Lịch sử thuê nhà</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
                <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand */}
            <Link className="navbar-brand ps-3" to="/home">Nhà Tốt</Link>

            {/* Sidebar Toggle */}
            <Button
                className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
                id="sidebarToggle"
                type="text" // Đặt type là "text" để nút không có background
            >
                <MenuOutlined style={{ color: '#fff' }} /> {/* Đặt icon trực tiếp bên trong nút */}
            </Button>
            {/* Navbar Right Side */}
            <ul className="navbar-nav ms-auto me-3">
                {/* Bell Icon for Notifications */}
                <li className="nav-item mx-2"> {/* Thêm lớp mx-2 */}
                    <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
                        <Badge count={unreadCount}>
                            <Button
                                type="text"
                                icon={<BellOutlined style={{ color: '#fff' }} />}
                                style={{ color: '#fff' }}
                            />
                        </Badge>
                    </Dropdown>
                </li>

                {/* Chat Notification Component */}
                <li className="nav-item mx-2"> {/* Thêm lớp mx-2 */}
                    <ChatNotification />
                </li>

                {/* User Icon and Dropdown */}
                <li className="nav-item mx-2"> {/* Thêm lớp mx-2 */}
                    <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<UserOutlined style={{ color: '#fff' }} />}
                            style={{ color: '#fff' }}
                        />
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
