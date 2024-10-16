import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserBooking.css';
import { Modal, Button } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserBooking = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

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
                const sortedBookingHistory = response.data.sort((a, b) => b.bookingId - a.bookingId);
                setBookingHistory(sortedBookingHistory);
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

    const canCancelBooking = (checkInDate) => {
        const inDate = new Date(checkInDate);
        const today = new Date();
        const diffTime = inDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 1;
    };

    const handleShowModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowModal(true);
    };

    const handleConfirmCancel = async () => {
        try {
            await axios.post(`http://localhost:8080/api/bookings/cancel?bookingId=${selectedBookingId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchBookingHistory();
            toast.success("Bạn đã hủy thuê nhà thành công."); // Hiển thị thông báo thành công
        } catch (error) {
            toast.error("Có lỗi xảy ra khi hủy thuê.");
        } finally {
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
            <ToastContainer />
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

                                {booking.status === "Chờ nhận phòng" && canCancelBooking(booking.checkInDate) && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleShowModal(booking.bookingId)}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy thuê</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn hủy thuê nhà này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Không
                    </Button>
                    <Button variant="danger" onClick={handleConfirmCancel}>
                        Xác nhận hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserBooking;
