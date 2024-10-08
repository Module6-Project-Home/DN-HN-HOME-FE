import React, {useEffect, useState} from 'react';
import axios from 'axios';
import HeroBanner from "./HeroBanner";
import {Link} from "react-router-dom";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [topBookingProperties, setTopBookingProperties] = useState([]); // State cho danh sách 5 property có lượt booking cao nhất

    // Tạo các state cho từng tham số tìm kiếm
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [roomType, setRoomType] = useState('');
    const [minBedrooms, setMinBedrooms] = useState('');
    const [maxBedrooms, setMaxBedrooms] = useState('');
    const [minBathrooms, setMinBathrooms] = useState('');
    const [maxBathrooms, setMaxBathrooms] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    const [propertyTypes, setPropertyTypes] = useState([]); // Danh sách loại tài sản từ API
    const [roomTypes, setRoomTypes] = useState([]); // Danh sách loại tài sản từ API
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/property-types');
                setPropertyTypes(response.data); // Giả sử API trả về danh sách loại tài sản
                if (response.data.length > 0) {
                    setPropertyType(response.data[0].name); // Chọn loại tài sản đầu tiên làm mặc định
                }
            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/room-types');
                setRoomTypes(response.data); // Giả sử API trả về danh sách loại phòng
                if (response.data.length > 0) {
                    setRoomType(response.data[0].name); // Chọn loại phòng đầu tiên làm mặc định
                }
            } catch (error) {
                console.error('Error fetching room types:', error);
            }
        };

        const fetchTopBookingProperties = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/properties/top-booking');
                setTopBookingProperties(response.data); // Lấy danh sách property có lượt booking cao nhất
            } catch (error) {
                console.error('Error fetching top booking properties:', error);
            }
        };

        fetchPropertyTypes();
        fetchRoomTypes();
        fetchTopBookingProperties(); // Gọi API lấy danh sách 5 property có lượt booking cao nhất
        fetchProperties(); // Gọi hàm fetchProperties để lấy danh sách nhà
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/properties/search', {
                params: {
                    name,
                    address,
                    minPrice,
                    maxPrice,
                    propertyType,
                    roomType,
                    minBedrooms,
                    maxBedrooms,
                    minBathrooms,
                    maxBathrooms,
                    checkInDate,
                    checkOutDate
                }
            });
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <div className="container-fluid fruite py-5">
            <HeroBanner />
            {/* Danh sách 5 property có lượt booking cao nhất */}
            <div className="container py-5">
                <h2 className="text-center mb-5">Top 5 Nhà Được Đặt Nhiều Nhất</h2>
                <div className="row g-4 justify-content-center">
                    {topBookingProperties.map((property) => (
                        <div className="col-md-2" key={property.id}>
                            <div className="rounded position-relative fruite-item">
                                <div className="fruite-img">
                                    <a href={`/property/detail/${property.id}`}>
                                        <img
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover'
                                            }}
                                            src={property.images?property.images: "https://via.placeholder.com/200"} // Đặt ảnh mặc định nếu không có ảnh
                                            alt="Property Image"
                                            className="img-fluid w-100 rounded"
                                        />
                                    </a>
                                </div>
                                <div className="p-2 border border-secondary border-top-0 rounded-bottom">
                                    <h5 className="property-name">{property.name}</h5>
                                    <h6 className="property-name">{property.address}</h6>
                                    <p className="text-muted">{property.pricePerNight.toLocaleString()} VNĐ/Đêm</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form tìm kiếm và danh sách property */}
            <div className="container py-5">
                <div className="row g-4 mb-5">
                    <div className="col-lg-12">
                        <div className="row g-4">
                            <div className="col-lg-3">
                                <div className="mb-3">
                                    <form className="form-inline mb-4" onSubmit={handleSearch}>
                                        <h5>Tìm kiếm theo thông tin nhà</h5>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="name" className="mr-2 mb-2 fw-bold">Tên Homestay: </label>
                                            <input id="name" type="text" className="form-control mb-2"
                                                   placeholder="Tên" value={name}
                                                   onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        {/* Các trường form tìm kiếm khác */}
                                        {/* Loại Nhà */}
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="propertyType" className="mr-2 mb-2 fw-bold">Loại Nhà: </label>
                                            <select
                                                id="propertyType"
                                                className="form-control mb-2"
                                                value={propertyType}
                                                onChange={(e) => setPropertyType(e.target.value)}
                                            >
                                                <option value="">-- Chọn loại nhà --</option>
                                                {propertyTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Loại Phòng */}
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="roomType" className="mr-2 mb-2 fw-bold">Loại Phòng: </label>
                                            <select
                                                id="roomType"
                                                className="form-control mb-2"
                                                value={roomType}
                                                onChange={(e) => setRoomType(e.target.value)}
                                            >
                                                <option value="">-- Chọn loại phòng --</option>
                                                {roomTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Các trường tìm kiếm khác */}
                                        <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-lg-9">
                                <div className="row g-4 justify-content-center">
                                    {properties.length === 0 ? (
                                        <p>Không có sản phẩm phù hợp</p>
                                    ) : (
                                        properties.map((property) => (
                                            <div className="col-md-6 col-lg-6 col-xl-4" key={property.id}>
                                                <div className="rounded position-relative fruite-item">
                                                    <div className="fruite-img">
                                                        <a href={`/property/detail/${property.id}`}>
                                                            <img
                                                                style={{
                                                                    width: '100%',
                                                                    height: '200px',
                                                                    objectFit: 'cover'
                                                                }}
                                                                src={property.imageUrls && property.imageUrls.length > 0
                                                                    ? property.imageUrls[0]
                                                                    : "https://via.placeholder.com/200"}
                                                                alt="Property Image"
                                                                className="img-fluid w-100 rounded-top"
                                                            />

                                                        </a>
                                                    </div>
                                                    <div
                                                        className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                                        style={{top: '10px', left: '10px'}}>
                                                        {property.propertyType}
                                                    </div>
                                                    <div
                                                        className="p-4 border border-secondary border-top-0 rounded-bottom">
                                                        <h5 className="property-name">{property.name}</h5>
                                                        <h6 className="property-name">{property.address}</h6>
                                                        <h6 className="property-name">{property.roomType}</h6>
                                                        <h6 className="property-name">{property.bedrooms} Phòng Ngủ
                                                            - {property.bathrooms} Phòng Tắm</h6>
                                                        <div className="d-flex justify-content-between flex-lg-wrap">
                                                            <p className="text-dark fs-5 fw-bold mb-0">
                                                                {property.pricePerNight.toLocaleString()} VNĐ/Đêm
                                                            </p>
                                                            <a href={`/bookings/create/${property.id}`}
                                                               className="btn border border-secondary rounded-pill px-3 text-primary">
                                                                Đặt phòng
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="col-12 d-flex justify-content-center">
                                    <div className="pagination mt-5">
                                        <ul className="pagination justify-content-center">
                                            {/* Logic phân trang ở đây */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);
};

export default PropertyList;

