import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";

const MonthlyRevenue = () => {
    const today = new Date();

    // Lấy ngày đầu tháng hiện tại
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Định dạng ngày thành 'YYYY-MM-DD'
    const formatDateToInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng 0-11 => cần +1
        const day = String(date.getDate()).padStart(2, '0'); // Ngày 1-31
        return `${year}-${month}-${day}`;
    };

    // Định dạng ngày thành 'DD/MM/YYYY'
    const formatDateToDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng 0-11 => cần +1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [revenues, setRevenues] = useState([]);
    const [startDate, setStartDate] = useState(formatDateToInput(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDateToInput(today));

    useEffect(() => {
        fetchRevenue(); // Gọi hàm fetchRevenue ngay khi component được render lần đầu tiên
    }, []);

    const validateData = () => {
        if (!startDate || !endDate) {
            toast.warning("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
            return false;
        }

        // Chuyển đổi ngày thành đối tượng Date để so sánh
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            toast.warning("Ngày bắt đầu phải trước ngày kết thúc.");
            return false;
        }

        return true; // Nếu mọi thứ hợp lệ
    };

    const fetchRevenue = async () => {
        if (!validateData()) {
            return; // Dừng nếu không hợp lệ
        }

        let jwtToken = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get('http://localhost:8080/api/host/monthlyRevenue', {
                params: { startDate, endDate },
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response)
            toast.success("Doanh thu của bạn đã được lấy ra thành công");
            const revenueData = response.data.map(item => ({
                year: item.year,
                month: item.month,
                revenue: item.revenue, // Chuyển đổi doanh thu thành chuỗi
            }));

            setRevenues(revenueData);
        } catch (error) {
            console.error('Error fetching monthly revenue:', error);
        }
    };

    const handleDateChange = (e) => {
        if (e.target.name === 'startDate') {
            setStartDate(e.target.value);
        } else if (e.target.name === 'endDate') {
            setEndDate(e.target.value);
        }
    };

    return (
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div id="layoutSidenav">
                    <SidebarAdmin className="col-md-3 col-lg-2" />
                    <div id="layoutSidenav_content" className="col-md-9 col-lg-10">
                        <main className="container mt-4">
                            <h2 className="mb-4">Doanh thu hàng tháng</h2>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu:</label>
                                    <DatePicker
                                        selected={startDate ? new Date(startDate) : null} // Kiểm tra nếu có giá trị startDate
                                        onChange={date => handleDateChange({ target: { name: 'startDate', value: date } })}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control"
                                        placeholderText="Chọn ngày bắt đầu"
                                    />

                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="endDate" className="form-label">Ngày kết thúc:</label>
                                    <DatePicker
                                        selected={endDate ? new Date(endDate) : null} // Kiểm tra nếu có giá trị endDate
                                        onChange={date => handleDateChange({ target: { name: 'endDate', value: date } })}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control"
                                        placeholderText="Chọn ngày kết thúc"
                                        minDate={startDate ? new Date(startDate) : null} // Ngày kết thúc phải sau ngày bắt đầu
                                    />

                                </div>
                            </div>
                            <button className="btn btn-primary mb-4" onClick={fetchRevenue}>Lấy doanh thu</button>
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="table-primary">
                                    <tr>
                                        <th>Năm</th>
                                        <th>Tháng</th>
                                        <th>Doanh thu</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {revenues.length > 0 ? (
                                        revenues.map((revenue, index) => (
                                            <tr key={index}>
                                                <td>{revenue.year}</td>
                                                <td>{revenue.month}</td>
                                                <td>{revenue.revenue.toLocaleString()} VNĐ</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">Bạn không có doanh thu trong khoảng thời gian này.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenue;
