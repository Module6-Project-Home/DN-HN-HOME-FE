import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './UserDetail.css';
import HeroBanner from "../property/HeroBanner";

const UserDetail = () => {
    const userId = localStorage.getItem('userId');
    const [userDetail, setUserDetail] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]); // State lưu lịch sử thuê nhà
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage] = useState(5); // Số mục trên mỗi trang
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('jwtToken');

    // Tính toán chỉ số của mục đầu tiên và mục cuối cùng cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBookings = bookingHistory.slice(indexOfFirstItem, indexOfLastItem);

    const fetchUserDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/user-detail?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserDetail(response.data);
        } catch (error) {
            console.error('Error fetching user detail:', error);
            setError('Không thể tải thông tin người dùng.');
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
            setBookingHistory(response.data);
        } catch (error) {
            console.error('Error fetching booking history:', error);
            setError('Không thể tải lịch sử thuê nhà.');
        }
    };

    useEffect(() => {
        fetchUserDetail();
        fetchBookingHistory(); // Lấy lịch sử thuê nhà
    }, [userId]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="user-detail-container">Đang tải thông tin người dùng...</div>;
    }

    if (error) {
        return <div className="user-detail-container">{error}</div>;
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
                    {currentBookings.length === 0 ? (
                        <p>Không có lịch sử thuê nhà.</p>
                    ) : (
                        currentBookings.map((booking, index) => (
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
                    )}
                </div>

                {/* Nút phân trang */}
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span>Trang {currentPage}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={indexOfLastItem >= bookingHistory.length}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
