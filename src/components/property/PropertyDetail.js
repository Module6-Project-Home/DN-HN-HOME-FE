import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, isBefore, isToday } from 'date-fns';
import { useAuth } from '../auth/AuthContext';
import HeroBanner from "./HeroBanner";
import './PropertyDetail.css';

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();

    // State cho việc đặt phòng
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [statusId] = useState(2);
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
            alert('Bạn cần đăng nhập để đặt phòng. Vui lòng đăng ký tài khoản.');
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
            status: { id: statusId },
        };

        try {
            await axios.post('http://localhost:8080/api/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(`Đặt phòng thành công! Bạn đã đặt ${totalDays} ngày, tổng tiền của bạn là ${totalPrice.toLocaleString()} VND`);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).join(', ');
                alert(`${errorMessages}`);
            } else {
                alert("Đã có lỗi xảy ra khi tạo booking, vui lòng thử lại.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <div>
            <HeroBanner />
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

                    <button className="booking-button" onClick={handleBooking}>Đặt ngay</button>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
