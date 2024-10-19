import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, isBefore, isToday } from 'date-fns';
import { useAuth } from '../auth/AuthContext';
import HeroBanner from "./HeroBanner";
import './PropertyDetail.css';
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';
import {Pagination} from "antd";
import {AlertLink} from "react-bootstrap";
import ChatWindow from "../comunication/ChatWindow";

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalBooking, setTotalBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const [showChat, setShowChat] = useState(false);

    // State cho việc đặt phòng
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingStatusId] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const userId = Number(localStorage.getItem('userId'));
    const [hiddenReviews, setHiddenReviews] = useState([]);


    useEffect(() => {
        fetchTotalBooking();
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/properties/detail/${id}`);
            setProperty(response.data);
            setLoading(false);

            localStorage.setItem('propertyId', id);
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


    const calculateTotalPrice = (checkInDate, checkOutDate, pricePerNight) => {
        const totalDays = differenceInDays(checkOutDate, checkInDate);
        return totalDays * pricePerNight;
    };

    const handleBooking = async () => {
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

        setErrorMessage('');

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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Bạn cần đăng nhập để gửi đánh giá.');
            return;
        }

        const reviewData = {
            guest: { username: localStorage.getItem('username') },
            property: { id },
            rating: rating,
            comment: comment,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/bookings/review', reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message || 'Đánh giá của bạn đã được gửi thành công!');

            setComment('');
            setRating(5);

            await fetchProperty(); // Cập nhật lại thông tin bất động sản, bao gồm đánh giá mới
            await fetchTotalBooking(); // Cập nhật lại tổng số đánh giá
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data || "Đã có lỗi xảy ra khi gửi đánh giá.");
            } else {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
            }

            console.error('Error submitting review:', error);
        }
    };


    const handleHideReview = async (reviewId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/host/reviews/${reviewId}/hide`);

            if (response.status === 200) {
                setCurrentReviews(prevReviews => {
                    const updatedReviews = prevReviews.map(review =>
                        review.id === reviewId ? { ...review, isValid: false } : review
                    );

                    const validReviews = updatedReviews.filter(review => review.isValid);

                    setTotalPages(Math.ceil(validReviews.length / itemsPerPage));

                    if (validReviews.length < (currentPage - 1) * itemsPerPage) {
                        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
                    }

                    const start = (currentPage - 1) * itemsPerPage;
                    return validReviews.slice(start, start + itemsPerPage);
                });

                await fetchProperty();

                toast.success("Ẩn đánh giá thành công");
            }
        } catch (error) {
            console.error("Error hiding review:", error);
        }
    };





    const [currentReviews, setCurrentReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const requestHideReview = (reviewId) => {
        setSelectedReviewId(reviewId);
        setShowConfirmModal(true);
    };



    useEffect(() => {
        if (property && property.reviews) {
            const validReviews = property.reviews.filter(review => review.isValid);

            const sortedReviews = validReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const indexOfLastReview = currentPage * itemsPerPage;
            const indexOfFirstReview = indexOfLastReview - itemsPerPage;

            setCurrentReviews(sortedReviews.slice(indexOfFirstReview, indexOfLastReview));

            setTotalPages(Math.ceil(validReviews.length / itemsPerPage));
        }
    }, [property, currentPage]);





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
            <Link to="/home" className="text-decoration-none m-lg-5">Trang chủ</Link>
            <ToastContainer />
            <div className="property-detail-container">
                {/* Cột bên trái - thông tin ngôi nhà */}
                <div className="property-info">
                    <div className="property-images">
                        <img
                            src={property.images && property.images.length > 0
                                ? property.images[0].imageUrl
                                : "https://firebasestorage.googleapis.com/v0/b/home-dn.appspot.com/o/biet-thu-2.jpg?alt=media&token=5fbefe7b-8a85-488a-9f53-b6be11fcaece"}
                            alt={`Main image of ${property.name}`}
                            className="main-property-image"
                        />
                        <div className="small-property-images">
                            {property.images && property.images.length > 1
                                ? property.images.slice(1).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.imageUrl}
                                        alt={`${property.name} image ${index + 2}`}
                                        className="small-property-image"
                                    />
                                ))
                                : (
                                    <img
                                        src="https://firebasestorage.googleapis.com/v0/b/home-dn.appspot.com/o/biet-thu-2.jpg?alt=media&token=5fbefe7b-8a85-488a-9f53-b6be11fcaece"
                                        alt="Default small image"
                                        className="small-property-image"
                                    />
                                )}
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
                        Link tới Google Maps:
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-info"
                        >
                            Xem chỉ dẫn
                        </a>
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
                    <button
                        className="chat-button"
                        onClick={() => setShowChat(true)} // Hiển thị cửa sổ chat
                    >
                        💬
                    </button>
                    {showChat && (
                        <ChatWindow onClose={() => setShowChat(false)} /> // Đóng chat
                    )}
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
                                const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                setCheckInDate(adjustedDate);
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
                                const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                setCheckOutDate(adjustedDate);
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

            <div className="review-form">
                <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                        <label>Đánh giá:</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                ★
                            </span>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Nhận xét:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="form-control"
                            rows="4"
                        />
                    </div>
                    <button type="submit" className="btn btn-success">Gửi đánh giá</button>
                </form>
            </div>

            <Modal show={showModal} onHide={handleClose} className="custom-modal" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{totalBooking ? totalBooking.total : 0} lượt đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                            review.isValid && (
                                <div key={review.id} className="review-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={review.avatar}
                                            alt="Avatar"
                                            className="img-thumbnail me-2"
                                        />
                                        <p className="mb-0">{review.guest.username}</p>
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
                                        <p className="mb-0 ms-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0">{review.comment}</p>
                                        {property && property.ownerId && Number(userId) === Number(property.ownerId) && (
                                            <button
                                                className="btn btn-danger ms-3"
                                                onClick={() => requestHideReview(review.id)}
                                            >
                                                Ẩn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <p>Chưa có đánh giá nào!</p>
                    )}
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

                {/* Modal Xác Nhận */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} className="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn ẩn đánh giá này không?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={() => {
                            handleHideReview(selectedReviewId);
                            setShowConfirmModal(false);
                        }}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
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
