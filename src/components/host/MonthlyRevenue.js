import React, { useState } from 'react';
import { DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";

// Import cần thiết cho Chart.js
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Đăng ký các scale và component
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

// Mở rộng dayjs với plugin isSameOrAfter
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;

const MonthlyRevenue = () => {
    const today = dayjs();
    const firstDayOfMonth = dayjs().startOf('month');

    const [revenues, setRevenues] = useState([]);
    const [dateRange, setDateRange] = useState([firstDayOfMonth, today]);

    const validateData = () => {
        const [start, end] = dateRange;

        if (!start || !end) {
            message.warning("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
            return false;
        }

        if (start.isSameOrAfter(end)) {
            message.warning("Ngày bắt đầu phải trước ngày kết thúc.");
            return false;
        }

        return true;
    };

    const fetchRevenue = async () => {
        if (!validateData()) {
            return;
        }

        let jwtToken = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get('http://localhost:8080/api/host/monthlyRevenue', {
                params: {
                    startDate: dateRange[0].format('YYYY-MM-DD'),
                    endDate: dateRange[1].format('YYYY-MM-DD')
                },
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            message.success("Doanh thu của bạn đã được lấy ra thành công");
            const revenueData = response.data.map(item => ({
                year: item.year,
                month: item.month,
                revenue: item.revenue,
            }));

            setRevenues(revenueData);
        } catch (error) {
            console.error('Error fetching monthly revenue:', error);
            message.error('Có lỗi xảy ra khi lấy dữ liệu doanh thu.');
        }
    };

    const handleDateChange = (dates) => {
        if (dates) {
            setDateRange(dates);
        }
    };

    // Cấu hình dữ liệu cho biểu đồ cột
    const chartData = {
        labels: revenues.map(item => `${item.month}/${item.year}`), // Nhãn trục x là tháng/năm
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: revenues.map(item => item.revenue), // Dữ liệu trục y là doanh thu
                backgroundColor: 'aqua', // Màu nền cột
                borderColor: 'aqua', // Màu viền cột
                borderWidth: 1,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Doanh thu hàng tháng',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `${value.toLocaleString()} VNĐ`, // Format tiền tệ trên trục y
                },
            },
        },
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
                                    <RangePicker
                                        value={dateRange}
                                        onChange={handleDateChange}
                                        format="DD-MM-YYYY"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <Button type="primary" onClick={fetchRevenue} className="mb-4">
                                Lấy doanh thu
                            </Button>

                            {revenues.length > 0 ? (
                                <Bar data={chartData} options={chartOptions} />
                            ) : (
                                <p>Bạn không có doanh thu trong khoảng thời gian này.</p>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenue;
