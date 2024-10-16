// components/MonthlyRevenue.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import {toast} from "react-toastify";

const MonthlyRevenue = () => {
    const [revenues, setRevenues] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
            toast.success("Doanh thu của bạn đã được lấy ra thành công");
            const revenueData = response.data.map(item => ({
                year: item.year,
                month: item.month,
                revenue: item.revenue.toString(), // Chuyển đổi doanh thu thành chuỗi
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
        <div className="container-fluid">
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div className="row" id="layoutSidenav">
                    <SidebarAdmin className="col-md-3 col-lg-2" />
                    <div id="layoutSidenav_content" className="col-md-9 col-lg-10">
                        <main className="container mt-4">
                            <h2 className="mb-4">Doanh thu hàng tháng</h2>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu:</label>
                                    <input type="date" id="startDate" name="startDate" className="form-control" value={startDate} onChange={handleDateChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="endDate" className="form-label">Ngày kết thúc:</label>
                                    <input type="date" id="endDate" name="endDate" className="form-control" value={endDate} onChange={handleDateChange} />
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
                                                <td>{revenue.revenue}</td>
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
