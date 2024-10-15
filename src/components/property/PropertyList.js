import React, {useEffect, useState} from 'react';
import axios from 'axios';
import HeroBanner from "./HeroBanner";
import './PropertyList.css'
import {Link, useLocation} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../auth/AuthContext";


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

    const { login } = useAuth();
    const location = useLocation();

    const getQueryParams = (urlSearchParams) => {
        const params = new URLSearchParams(urlSearchParams);
        return params.get('token'); // Get token value
    };


    const tokenFromParams = getQueryParams(location.search);
    console.log('tokenFromParams', tokenFromParams);

    useEffect(() => {

        document.title = "Property List";
        const fetchUser = async () => {
            if (tokenFromParams) {
                const decoded = jwtDecode(tokenFromParams);
                const username = decoded.sub;
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/findByUsername?username=${username}`);
                    console.log(response.data, 'response');
                    const { roles, id } = response.data;

                    console.log('Fetched Roles from API:', roles); // Kiểm tra vai trò trả về từ API
                    console.log('Fetched User ID:', id);           // Kiểm tra User ID
                    // Lưu thông tin vào localStorage
                    localStorage.setItem('jwtToken', tokenFromParams);
                    localStorage.setItem('username', username);
                    localStorage.setItem('roles', JSON.stringify(roles));
                    localStorage.setItem('userId', id);

                    // Gọi login để cập nhật context
                    login(username, roles, id, tokenFromParams);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/property-types');
                setPropertyTypes(response.data); // Giả sử API trả về danh sách loại tài sản

            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/room-types');
                setRoomTypes(response.data); // Giả sử API trả về danh sách loại phòng

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
                                    <Link to={`/property/detail/${property.id}`}>
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
                                    </Link>
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
                                            <input id={"name"} type="text" className="form-control mb-2"
                                                   placeholder="Tên" value={name}
                                                   onChange={(e) => setName(e.target.value)}/>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="address" className="mr-2 mb-2 fw-bold">Địa chỉ: </label>
                                            <input id={"address"} type="text" className="form-control mb-2" placeholder="Địa chỉ"
                                                   value={address} onChange={(e) => setAddress(e.target.value)}/>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="propertyType" className="mr-2 mb-2 fw-bold">Loại Nhà: </label>
                                            {/* Chọn Loại Nhà */}
                                            <select
                                                id={"propertyType"}
                                                className="form-control mb-2"
                                                value={propertyType}
                                                onChange={(e) => setPropertyType(e.target.value)}
                                            >
                                                <option value="">-- Chọn loại nhà--</option>
                                                {propertyTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="roomType" className="mr-2 mb-2 fw-bold">Loại Phòng: </label>
                                            {/* Chọn Loại Phòng */}
                                            <select
                                                id={"roomType"}
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
                                        {/*<input type="text" className="form-control mb-2" placeholder="Loại nhà" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />*/}
                                        {/*<input type="text" className="form-control mb-2" placeholder="Loại phòng" value={roomType} onChange={(e) => setRoomType(e.target.value)} />*/}
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bedroom" className="mr-2 mb-2 fw-bold">Phòng Ngủ: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng ngủ tối thiểu" value={minBedrooms}
                                                   onChange={(e) => setMinBedrooms(e.target.value)}/>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng ngủ tối đa" value={maxBedrooms}
                                                   onChange={(e) => setMaxBedrooms(e.target.value)}/>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bathroom" className="mr-2 mb-2 fw-bold">Phòng Tắm: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng tắm tối thiểu" value={minBathrooms}
                                                   onChange={(e) => setMinBathrooms(e.target.value)}/>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng tắm tối đa" value={maxBathrooms}
                                                   onChange={(e) => setMaxBathrooms(e.target.value)}/>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="price" className="mr-2 mb-2 fw-bold">Giá: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Giá tối thiểu" value={minPrice}
                                                   onChange={(e) => setMinPrice(e.target.value)}/>
                                            <input type="number" className="form-control mb-2" placeholder="Giá tối đa"
                                                   value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="checkInDate" className="mr-2 mb-2 fw-bold">Khoảng thời gian: </label>
                                            <input type="date" className="form-control mb-2" placeholder="Ngày check-in"
                                                   value={checkInDate}
                                                   onChange={(e) => setCheckInDate(e.target.value)}/>
                                            <input type="date" className="form-control mb-2"
                                                   placeholder="Ngày check-out" value={checkOutDate}
                                                   onChange={(e) => setCheckOutDate(e.target.value)}/>
                                        </div>
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
                                                        <Link to={`/property/detail/${property.id}`}>
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

                                                        </Link>
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