import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Button, Pagination, Form, Card } from "react-bootstrap";
import { DatePicker, Badge } from "antd";
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";

const { RangePicker } = DatePicker;

const OwnerBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchCriteria, setSearchCriteria] = useState({
        houseName: '',
        startDate: null,
        endDate: null,
        status: ''
    });

    const fetchBookingHistory = async () => {
        let jwtToken = localStorage.getItem("jwtToken");
        try {
            const response = await axios.get("http://localhost:8080/api/bookings/ownerHistory", {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                setError("Invalid response format");
            }
        } catch (error) {
            setError("Cannot fetch booking history");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const handleSearchChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };

    const handleDateChange = (dates) => {
        setSearchCriteria({
            ...searchCriteria,
            startDate: dates ? dates[0].startOf('day').toISOString() : null,
            endDate: dates ? dates[1].endOf('day').toISOString() : null
        });
    };

    const handleStatusChange = (e) => {
        setSearchCriteria({ ...searchCriteria, status: e.target.value });
    };

    // Filter bookings based on search criteria
    const filteredBookings = bookings.filter((booking) => {
        const matchesHouseName = booking.propertyName.toLowerCase().includes(searchCriteria.houseName.toLowerCase());
        const matchesDateRange = (!searchCriteria.startDate || new Date(booking.checkInDate) >= new Date(searchCriteria.startDate)) &&
            (!searchCriteria.endDate || new Date(booking.checkOutDate) <= new Date(searchCriteria.endDate));
        const matchesStatus = !searchCriteria.status || booking.bookingStatus === searchCriteria.status;

        return matchesHouseName && matchesDateRange && matchesStatus;
    });

    // Calculate pagination data
    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const handleCheckIn = async (bookingId) => {
        let jwtToken = localStorage.getItem("jwtToken");
        try {
            await axios.post(`http://localhost:8080/api/bookings/checkin/${bookingId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchBookingHistory();
        } catch (error) {
            setError("Cannot check in");
            console.error(error);
        }
    };

    const handleCheckOut = async (bookingId) => {
        let jwtToken = localStorage.getItem("jwtToken");
        try {
            await axios.post(`http://localhost:8080/api/bookings/checkout/${bookingId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchBookingHistory();
        } catch (error) {
            setError("Cannot check out");
            console.error(error);
        }
    };

    // Count current bookings (active)
    const currentBookingCount = filteredBookings.filter(booking =>
        booking.bookingStatus === "Chờ nhận phòng" || booking.bookingStatus === "Đang ở"
    ).length;

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div id="layoutSidenav">
                    <SidebarAdmin />
                    <div id="layoutSidenav_content">
                        <main className="p-4">
                            <Card className="mb-4">
                                <Card.Body>
                                    <h2>Lịch Sử Đặt Phòng Của Khách</h2>
                                    <p>Tổng số đơn hiện tại: {currentBookingCount}</p>
                                </Card.Body>
                            </Card>

                            {/* Search Filters */}
                            <Card className="mb-4">
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="houseName">
                                            <Form.Label>Tên Ngôi Nhà</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="houseName"
                                                value={searchCriteria.houseName}
                                                onChange={handleSearchChange}
                                                placeholder="Nhập tên nhà"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="dateRange">
                                            <Form.Label>Khoảng Thời Gian</Form.Label>
                                            <RangePicker onChange={handleDateChange} style={{ width: '100%' }} />
                                        </Form.Group>
                                        <Form.Group controlId="bookingStatus">
                                            <Form.Label>Trạng Thái</Form.Label>
                                            <Form.Control as="select" name="status" value={searchCriteria.status} onChange={handleStatusChange}>
                                                <option value="">Tất cả</option>
                                                <option value="Chờ nhận phòng">Chờ nhận phòng</option>
                                                <option value="Đang ở">Đang ở</option>
                                                <option value="Đã trả phòng">Đã trả phòng</option>
                                                <option value="Đã hủy">Đã hủy</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr className="text-center">
                                    <th>STT</th>
                                    <th>Tên Khách</th>
                                    <th>Tên Ngôi Nhà</th>
                                    <th>Thời gian thuê</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentBookings.length > 0 ? (
                                    currentBookings.map((booking, index) => (
                                        <tr key={booking.id}>
                                            <td className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <td>{booking.guest}</td>
                                            <td>{booking.propertyName}</td>
                                            <td className="text-center">{booking.checkInDate} -> {booking.checkOutDate}</td>
                                            <td className="text-center">
                                                {booking.bookingStatus === "Chờ nhận phòng" && (
                                                    <Badge status="warning" text="Chờ nhận phòng" />
                                                )}
                                                {booking.bookingStatus === "Đang ở" && (
                                                    <Badge status="processing" text="Đang ở" />
                                                )}
                                                {booking.bookingStatus === "Đã trả phòng" && (
                                                    <Badge status="success" text="Đã trả phòng" />
                                                )}
                                            </td>
                                            <td className="flex justify-content-center">
                                                {booking.bookingStatus === "Chờ nhận phòng" && (
                                                    <Button variant="primary" className="me-2" onClick={() => handleCheckIn(booking.id)}>Nhận Phòng</Button>
                                                )}
                                                {booking.bookingStatus === "Đang ở" && (
                                                    <Button variant="success" onClick={() => handleCheckOut(booking.id)}>Trả Phòng</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">Không có đặt phòng nào</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            {/* Pagination Controls */}
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                />
                                {[...Array(totalPages).keys()].map((number) => (
                                    <Pagination.Item
                                        key={number + 1}
                                        active={number + 1 === currentPage}
                                        onClick={() => setCurrentPage(number + 1)}
                                    >
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBookingHistory;
