import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserDetail.css';
import HeroBanner from "../property/HeroBanner";

const UserDetail = () => {
    const userId = localStorage.getItem('userId');
    const [userDetail, setUserDetail] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('jwtToken');

    const fetchUserDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/user-detail?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserDetail(response.data);
        } catch (error) {
            setError('Có lỗi xảy ra khi tải thông tin người dùng.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bookings/history?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data)) {
                setBookingHistory(response.data);
            } else {
                setError(response.data.message || 'Có lỗi xảy ra khi tải lịch sử thuê nhà.');
                setBookingHistory([]);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi tải lịch sử thuê nhà.');
        }
    };

    useEffect(() => {
        fetchUserDetail();
        fetchBookingHistory();
    }, [userId]);

    if (loading) {
        return <div className="user-detail-container">Đang tải thông tin...</div>;
    }

    if (!userDetail) {
        return <div className="user-detail-container">Không tìm thấy thông tin người dùng.</div>;
    }

    return (
        <div>
            <HeroBanner />
            <div className="user-detail-container">
                <h2>Thông tin người dùng</h2>
                <div className="user-avatar">
                    <img src={userDetail.avatar} alt={`${userDetail.fullName} Avatar`} />
                </div>
                <div className="user-info">
                    <p><strong>Họ và tên:</strong> {userDetail.fullName}</p>
                    <p><strong>Tên đăng nhập:</strong> {userDetail.username}</p>
                    <p><strong>Số điện thoại:</strong> {userDetail.phoneNumber}</p>
                    <p><strong>Tổng chi tiêu:</strong> {userDetail.totalSpent.toLocaleString()} VNĐ</p>
                    <p className={`user-status ${userDetail.userStatus === 1 ? 'active' : 'inactive'}`}>
                        <strong>Trạng thái người dùng:</strong> {userDetail.userStatus === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </p>
                </div>

                {/* Lịch sử thuê nhà */}
                <h2>Lịch sử thuê nhà</h2>
                <div className="booking-history">
                    {bookingHistory.length > 0 ? (
                        bookingHistory.map((booking, index) => (
                            <div key={index} className="booking-item">
                                <h3>{booking.propertyName}</h3>
                                <p><strong>Địa chỉ:</strong> {booking.address}</p>
                                <p><strong>Thời gian thuê:</strong> {booking.rentalPeriod} ngày</p>
                                <p><strong>Tổng chi tiêu:</strong> {booking.totalSpent.toLocaleString()} VNĐ</p>
                                <p className={`booking-status ${booking.status.toLowerCase()}`}>
                                    <strong>Trạng thái:</strong> {booking.status}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>{error || 'Bạn chưa có booking nào.'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
