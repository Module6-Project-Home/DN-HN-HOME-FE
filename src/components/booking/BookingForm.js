import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import { useParams } from 'react-router-dom';
import HeroBanner from "../property/HeroBanner"; // Import useParams để lấy propertyId từ URL

const BookingForm = ({ pricePerNight }) => {
    const { id: propertyId } = useParams(); // Lấy propertyId từ URL

    // Validation schema
    const validationSchema = Yup.object({
        checkInDate: Yup.date()
            .nullable()
            .required("Vui lòng chọn ngày check-in")
            .test('is-future-date', 'Ngày check-in phải sau hôm nay', function (value) {
                const today = new Date();
                return value && value > today;
            }),
        checkOutDate: Yup.date()
            .nullable()
            .required("Vui lòng chọn ngày check-out")
            .test('is-after-checkin', 'Bạn phải ở ít nhất 1 đêm', function (value) {
                const { checkInDate } = this.parent;
                return checkInDate && value && differenceInDays(value, checkInDate) >= 1;
            })
    });

    // Hàm xử lý submit form
    const handleSubmit = async (values) => {
        const totalDays = differenceInDays(values.checkOutDate, values.checkInDate);
        const totalPrice = totalDays * pricePerNight;

        const bookingData = {
            property: { id: propertyId },
            checkInDate: values.checkInDate,
            checkOutDate: values.checkOutDate
        };

        try {
            await axios.post('http://localhost:8080/api/bookings/create', bookingData);
            alert(`Đặt phòng thành công! Tổng tiền: ${totalPrice} VND`);
        } catch (error) {
            console.error('Error creating booking:', error);
            alert("Đã có lỗi xảy ra khi tạo booking, vui lòng thử lại.");
        }
    };

    return (
        <div>
            <HeroBanner></HeroBanner>
        <Formik
            initialValues={{
                checkInDate: null,
                checkOutDate: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div>
                        <label>Ngày bắt đầu:</label>
                        <DatePicker
                            selected={values.checkInDate}
                            onChange={date => setFieldValue('checkInDate', date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày bắt đầu"
                        />
                        <ErrorMessage name="checkInDate" component="div" style={{ color: 'red' }} />
                    </div>

                    <div>
                        <label>Ngày kết thúc:</label>
                        <DatePicker
                            selected={values.checkOutDate}
                            onChange={date => setFieldValue('checkOutDate', date)}
                            minDate={values.checkInDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày kết thúc"
                        />
                        <ErrorMessage name="checkOutDate" component="div" style={{ color: 'red' }} />
                    </div>

                    <button type="submit">Đặt ngay</button>
                </Form>
            )}
        </Formik>
        </div>
    );
};

export default BookingForm;
