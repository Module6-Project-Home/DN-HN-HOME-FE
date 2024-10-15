import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './UserHistoryBooking.css';
import HeroBanner from "../property/HeroBanner";
import {useLocation, useParams} from "react-router-dom";

const UserHistoryBooking = () => {
    const {userId} = useParams();
    const location = useLocation();
    const {fullName} = location.state || {};
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of bookings per page
    const token = localStorage.getItem('jwtToken');

    const fetchBookingHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/history?userId=${userId}`, {
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, [userId]);

    // Calculate current bookings based on pagination
    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookingHistory.slice(indexOfFirstBooking, indexOfLastBooking);

    // Pagination logic
    const totalPages = Math.ceil(bookingHistory.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div className="user-detail-container">Đang tải lịch sử thuê nhà...</div>;
    }

    return (
        <div>
            {/*<HeroBanner/>*/}
            <div className="user-detail-container">
                <br/>
                <br/>
                <br/>
                <h2 className={"booking-name"}>Lịch sử thuê nhà: {fullName}</h2>
                <div className="booking-history">
                    {currentBookings.length > 0 ? (
                        currentBookings.map((booking, index) => (
                            <div key={index} className="booking-item">
                                <h3>{booking.propertyName}</h3>
                                <p><strong>Địa chỉ:</strong> {booking.address}</p>
                                <p><strong>Ngày nhận phòng:</strong> {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Ngày trả phòng:</strong> {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Tổng chi tiêu:</strong> {booking.totalSpent.toLocaleString()} VNĐ</p>
                                <p className={`booking-status 
                                        ${booking.status === "Đã trả phòng" ? "checkout" :
                                        booking.status === "Chờ nhận phòng" ? "pending" :
                                        booking.status === "Đang ở" ? "checkin" :
                                            booking.status === "Đã huỷ" ? "cancelled" : ""}`}>
                                    <strong>Trạng thái:</strong> {booking.status}
                                </p>

                            </div>
                        ))
                    ) : (
                        <p>{error || 'Bạn chưa có booking nào.'}</p>
                    )}
                </div>

                <div className="pagination">
                    {currentBookings.length > 0 && (
                        <>
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Trang trước</button>
                            <span>Trang {currentPage} / {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Trang tiếp</button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserHistoryBooking;
