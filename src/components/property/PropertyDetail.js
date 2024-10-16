import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, isBefore, isToday } from 'date-fns';
import { useAuth } from '../auth/AuthContext';
import HeroBanner from "./HeroBanner";
import './PropertyDetail.css';
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';
import {Pagination} from "antd";

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalBooking, setTotalBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');

    // State cho việc đặt phòng
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingStatusId] = useState(1);
    const [errorMessage, setErrorMessage] = useState(''); // State để lưu thông báo lỗi

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/properties/detail/${id}`);
                setProperty(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching property:', error);
                setLoading(false);
            }
        };
        const fetchTotalBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reviews/total?propertyId=${id}`);
                setTotalBooking(response.data);
            } catch (error) {
                console.error('Error fetching total bookings:', error);
            }
        };
        fetchTotalBooking();
        fetchProperty();
    }, [id]);

    const calculateTotalPrice = (checkInDate, checkOutDate, pricePerNight) => {
        const totalDays = differenceInDays(checkOutDate, checkInDate);
        return totalDays * pricePerNight;
    };

    const handleBooking = async () => {
        // Kiểm tra hợp lệ cho check-in và check-out
        if (!checkInDate || !checkOutDate) {
            setErrorMessage('Vui lòng chọn ngày.');
            return;
        }

        if (isBefore(checkInDate, new Date()) || isToday(checkInDate)) {
            setErrorMessage('Vui lòng đặt nhà trước một ngày.');
            return;
        }

        if (differenceInDays(checkOutDate, checkInDate) < 1) {
            setErrorMessage('Bạn phải ở lại ít nhất một đêm.');
            return;
        }

        // Nếu hợp lệ, reset thông báo lỗi
        setErrorMessage('');

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!token) {
            toast.success('Bạn cần đăng nhập để đặt phòng. Vui lòng đăng ký tài khoản.');
            navigate('/login'); // Điều hướng đến trang đăng nhập
            return;
        }

        const totalDays = differenceInDays(checkOutDate, checkInDate);
        const totalPrice = totalDays * property.pricePerNight;

        const bookingData = {
            guest: { username: localStorage.getItem('username') },
            property: { id },
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            bookingStatus: { id: bookingStatusId },
        };

        try {
            await axios.post('http://localhost:8080/api/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(`Đặt phòng thành công! Bạn đã đặt ${totalDays} ngày, tổng tiền của bạn là ${totalPrice.toLocaleString()} VND`);
            setTimeout(() => {
                navigate('/user/history-booking');
            }, 5000);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).join(', ');
                toast.warning(`${errorMessages}`);
            } else {
                toast.error("Đã có lỗi xảy ra khi tạo booking, vui lòng thử lại.");
            }
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastReview = currentPage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = property && property.reviews ? property.reviews.slice(indexOfFirstReview, indexOfLastReview) : [];
    const totalPages = property && property.reviews ? Math.ceil(property.reviews.length / itemsPerPage) : 0;

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <div>
            <HeroBanner />
            <ToastContainer />
            <div className="property-detail-container">
                {/* Cột bên trái - thông tin ngôi nhà */}
                <div className="property-info">
                    <div className="property-images">
                        <img
                            src={property.images[0].imageUrl}
                            alt={`Main image of ${property.name}`}
                            className="main-property-image"
                        />
                        <div className="small-property-images">
                            {property.images.slice(1).map((url, index) => (
                                <img
                                    key={index}
                                    src={url.imageUrl}
                                    alt={`${property.name} image ${index + 2}`}
                                    className="small-property-image"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="property-details">
                        <h4>{property.name}</h4>
                        <h5>Nhà tại {property.address}</h5>
                        <p>Mô tả: {property.description}</p>
                        <div className="rooms-info">
                            <p>{property.bedrooms} phòng ngủ</p>
                            <p>{property.bathrooms} phòng tắm</p>
                        </div>
                    </div>
                    <div className="total-booking">
                        <h5>
                            <i className="fas fa-star"></i> {totalBooking && totalBooking.reviewed ? totalBooking.reviewed.toFixed(1) : 'N/A'}
                        </h5>
                        <span className="separator">|</span>
                        <h5 className="underlined" onClick={handleShow} style={{ cursor: 'pointer' }}>
                            {totalBooking ? totalBooking.total : 0} Đánh giá
                        </h5>
                    </div>
                </div>

                {/* Cột bên phải - form đặt phòng */}
                <div className="booking-form">
                    <h2>Đặt phòng ngay:</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Hiển thị thông báo lỗi */}
                    <div className="form-group">
                        <label>Ngày bắt đầu:</label>
                        <DatePicker
                            selected={checkInDate}
                            onChange={date => {
                                setCheckInDate(date);
                                if (checkOutDate) {
                                    setTotalPrice(calculateTotalPrice(date, checkOutDate, property.pricePerNight));
                                }
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày bắt đầu"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc:</label>
                        <DatePicker
                            selected={checkOutDate}
                            onChange={date => {
                                setCheckOutDate(date);
                                if (checkInDate) {
                                    setTotalPrice(calculateTotalPrice(checkInDate, date, property.pricePerNight));
                                }
                            }}
                            minDate={checkInDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày kết thúc"
                        />
                    </div>

                    <div className="total-price">
                        <p>{property.pricePerNight.toLocaleString()} Đ/Đêm</p>
                        <p>Tổng tiền: {totalPrice.toLocaleString()} Đ</p>
                    </div>

                    <button className="btn btn-primary" onClick={handleBooking}>Đặt phòng</button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} className="custom-modal" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{totalBooking ? totalBooking.total : 0} lượt đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentReviews.length > 0 ?(
                    currentReviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <div className="d-flex align-items-center">
                                <img
                                    src={review.avatar}
                                    alt="Avatar"
                                    className="img-thumbnail me-2"
                                />
                                <p className="mb-0">{review.guest}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <p className="mb-0 me-2">
                                    <strong>Rating:</strong>
                                </p>
                                {[...Array(5)].map((_, starIndex) => (
                                    <span
                                        key={starIndex}
                                        className={starIndex < review.rating ? 'text-warning' : 'text-secondary'}
                                    >
                            ★
                        </span>
                                ))}
                                <p className="mb-0 ms-2">{review.createdAt}</p>
                            </div>
                            <p>{review.comment}</p>
                        </div>
                    ))) : (
                        <p>Chưa có đánh giá nào!</p>
                        )
                    }

                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between align-items-center">
                    <div className="pagination d-flex justify-content-center align-items-center w-100">
                        <Button
                            variant="light"
                            disabled={currentPage === 1}
                            onClick={() => paginate(currentPage - 1)}
                            className="mx-2"
                        >
                            Trang trước
                        </Button>

                        <span className="mx-3">{currentPage} / {totalPages}</span>

                        <Button
                            variant="light"
                            disabled={currentPage === totalPages}
                            onClick={() => paginate(currentPage + 1)}
                            className="mx-2"
                        >
                            Trang sau
                        </Button>
                    </div>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>



            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={property.reviews.length}
                paginate={paginate}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
};

export default PropertyDetail;
