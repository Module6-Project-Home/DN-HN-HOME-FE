import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import HeroBanner from "../property/HeroBanner";
import {toast, ToastContainer} from "react-toastify";

const BookingForm = ({ pricePerNight }) => {
    const { id: propertyId } = useParams();
    const { token } = useAuth();
    const [statusId] = useState(2);

    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);

    const handleSubmit = async (values) => {
        const totalDays = differenceInDays(values.checkOutDate, values.checkInDate);
        const totalPrice = totalDays * pricePerNight;

        const bookingData = {
            guest: { username: localStorage.getItem('username') },
            property: { id: propertyId },
            checkInDate: values.checkInDate,
            checkOutDate: values.checkOutDate,
            status: { id: statusId },
        };

        console.log("Booking data to be sent:", bookingData);

        try {
            await axios.post('http://localhost:8080/api/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(` phòng thành công! bạn đã đặt ${totalDays} ngày tổng tiền của bạn là ${totalPrice}`);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).join(', ');
                toast.success(`${errorMessages}`);
            } else {
                toast.success("Đã có lỗi xảy ra khi tạo booking, vui lòng thử lại.");
            }
        }

    };

    return (
        <div>
            <HeroBanner />
            <ToastContainer />
            <Formik
                initialValues={{
                    checkInDate: null,
                    checkOutDate: null
                }}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>

                        <div>
                            <label>Ngày bắt đầu:</label>
                            <DatePicker
                                selected={checkInDate}
                                onChange={date => {
                                    setFieldValue('checkInDate', date);
                                    setCheckInDate(date);
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Chọn ngày bắt đầu"
                            />
                        </div>

                        <div>
                            <label>Ngày kết thúc:</label>
                            <DatePicker
                                selected={checkOutDate}
                                onChange={date => {
                                    setFieldValue('checkOutDate', date);
                                    setCheckOutDate(date);
                                }}
                                minDate={checkInDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Chọn ngày kết thúc"
                            />
                        </div>

                        <button type="submit">Đặt ngay</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default BookingForm;
