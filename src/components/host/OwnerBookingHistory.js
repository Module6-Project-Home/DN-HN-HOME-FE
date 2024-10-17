import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Button, Pagination } from "react-bootstrap";
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";

const OwnerBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page

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
                setError("Unexpected response format");
            }
        } catch (error) {
            setError("Unable to fetch booking history");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

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
            setError("Unable to check in");
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
            setError("Unable to check out");
            console.error(error);
        }
    };

    // Calculate paginated data
    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

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
                        <main>
                            <h2>Your Booking History</h2>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Guest Name</th>
                                    <th>Property</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentBookings.length > 0 ? (
                                    currentBookings.map((booking, index) => (
                                        <tr key={booking.id}>
                                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <td>{booking.guest}</td>
                                            <td>{booking.propertyName}</td>
                                            <td>{booking.checkInDate}</td>
                                            <td>{booking.checkOutDate}</td>
                                            <td>{booking.bookingStatus}</td>
                                            <td>
                                                {booking.bookingStatus === "Chờ nhận phòng" && (
                                                    <Button variant="primary" onClick={() => handleCheckIn(booking.id)}>Check In</Button>
                                                )}
                                                {booking.bookingStatus === "Đang ở" && (
                                                    <Button variant="success" onClick={() => handleCheckOut(booking.id)}>Check Out</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No bookings available</td>
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
