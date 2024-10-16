import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserBooking.css';
import HeroBanner from "../property/HeroBanner";
import {toast} from "react-toastify";

const UserBooking = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of bookings per page
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');

    const fetchBookingHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/history-booking?userId=${userId}`, {
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

    // Tính toán thời gian còn lại > 1 ngày tính từ thời điểm hiện tại đến ngày check-in
    const canCancelBooking = (checkInDate) => {
        const inDate = new Date(checkInDate);
        const today = new Date();
        const diffTime = inDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi từ milliseconds sang ngày
        return diffDays > 1;
    };

    // Gọi API để hủy đơn thuê
    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.post(`http://localhost:8080/api/bookings/cancel?bookingId=${bookingId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Cập nhật lại lịch sử sau khi hủy
            fetchBookingHistory();
            toast.success("Bạn đã hủy thuê nhà thành công.");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi hủy thuê.");
        }
    };

    // Pagination logic
    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookingHistory.slice(indexOfFirstBooking, indexOfLastBooking);
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
            <div className="user-detail-container">
                <br />
                <br />
                <br />
                <h2 className={"booking-name"}>Lịch sử thuê nhà của bạn</h2>
                <div className="booking-history">
                    {currentBookings.length > 0 ? (
                        currentBookings.map((booking, index) => (
                            <div key={index} className="booking-item">
                                <h3>{booking.propertyName}</h3>
                                <p><strong>Địa chỉ:</strong> {booking.address}</p>
                                <p><strong>Ngày nhận phòng:</strong> {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Ngày trả phòng:</strong> {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Tổng đơn:</strong> {booking.totalSpent.toLocaleString()} VNĐ</p>
                                <p className={`booking-status 
                                        ${booking.status === "Đã trả phòng" ? "checkout" :
                                    booking.status === "Chờ nhận phòng" ? "pending" :
                                        booking.status === "Đang ở" ? "checkin" :
                                            booking.status === "Đã huỷ" ? "cancelled" : ""}`}>
                                    <strong>Trạng thái:</strong> {booking.status}
                                </p>

                                {/* Hiển thị nút "Hủy thuê" nếu thời gian còn lại > 1 ngày và trạng thái là "Chờ nhận phòng" */}
                                {booking.status === "Chờ nhận phòng" && canCancelBooking(booking.checkInDate) && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelBooking(booking.bookingId)}
                                    >
                                        Hủy thuê
                                    </button>
                                )}
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

export default UserBooking;
