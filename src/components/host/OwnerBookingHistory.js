import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert } from "react-bootstrap";
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";

const OwnerBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            let jwtToken = localStorage.getItem("jwtToken");
            try {
                const response = await axios.get("http://localhost:8080/api/bookings/ownerHistory", {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setBookings(response.data);
            } catch (error) {
                setError("Unable to fetch booking history");
            }
        };

        fetchBookingHistory();
    }, []);

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
                </tr>
                </thead>
                <tbody>
                {bookings.map((booking, index) => (
                    <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.guest}</td>
                        <td>{booking.propertyName}</td>
                        <td>{booking.checkInDate}</td>
                        <td>{booking.checkOutDate}</td>
                        <td>{booking.bookingStatus}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
                </main>
            </div>
        </div>
</div>
</div>
    );
};

export default OwnerBookingHistory;
