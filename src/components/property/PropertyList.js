import React, {useEffect, useState} from 'react';
import axios from 'axios';
import HeroBanner from "./HeroBanner";
import './PropertyList.css'
import {Link, useLocation} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../auth/AuthContext";
import { Slider } from '@mui/material';  // Import Slider từ Material-UI


const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [topBookingProperties, setTopBookingProperties] = useState([]); // State cho danh sách 5 property có lượt booking cao nhất

    // Tạo các state cho từng tham số tìm kiếm
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
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
        document.title = "Danh sách nhà";
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
                    minPrice: priceRange[0], // Sử dụng giá trị min từ thanh kéo
                    maxPrice: priceRange[1], // Sử dụng giá trị max từ thanh kéo
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
        <div className=" fruite py-5">
            <HeroBanner/>
            <hr className="my-5"/>
            {/* Danh sách 5 property có lượt booking cao nhất */}
            <div className="container py-5">
                <h2 className="text-center mb-5" style={{color: 'blue'}}>5 Nhà Được Đặt Nhiều Nhất</h2>
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
                                            src={property.images ? property.images : "https://via.placeholder.com/200"} // Đặt ảnh mặc định nếu không có ảnh
                                            alt="Property Image"
                                            className="img-fluid w-100 rounded"
                                        />
                                    </Link>
                                </div>
                                <div className="p-2 border border-secondary border-top-0 rounded-bottom">
                                    <h5 className="property-name">{property.name}</h5>
                                    <h6 className="property-address">{property.address}</h6>
                                    <p className="text-muted">{property.pricePerNight.toLocaleString()} VNĐ/Đêm</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-5"/>


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
                                            <input id={"address"} type="text" className="form-control mb-2"
                                                   placeholder="Địa chỉ"
                                                   value={address} onChange={(e) => setAddress(e.target.value)}/>
                                        </div>
                                        {/*<div className="form-group mr-2 mb-3">*/}
                                        {/*    <label htmlFor="propertyType" className="mr-2 mb-2 fw-bold">Loại Nhà: </label>*/}
                                        {/*    /!* Chọn Loại Nhà *!/*/}
                                        {/*    <select*/}
                                        {/*        id={"propertyType"}*/}
                                        {/*        className="form-control mb-2"*/}
                                        {/*        value={propertyType}*/}
                                        {/*        onChange={(e) => setPropertyType(e.target.value)}*/}
                                        {/*    >*/}
                                        {/*        <option value="">-- Chọn loại nhà--</option>*/}
                                        {/*        {propertyTypes.map((type) => (*/}
                                        {/*            <option key={type.id} value={type.id}>*/}
                                        {/*                {type.name}*/}
                                        {/*            </option>*/}
                                        {/*        ))}*/}

                                        {/*    </select>*/}
                                        {/*</div>*/}
                                        {/*<div className="form-group mr-2 mb-3">*/}
                                        {/*    <label htmlFor="roomType" className="mr-2 mb-2 fw-bold">Loại Phòng: </label>*/}
                                        {/*    /!* Chọn Loại Phòng *!/*/}
                                        {/*    <select*/}
                                        {/*        id={"roomType"}*/}
                                        {/*        className="form-control mb-2"*/}
                                        {/*        value={roomType}*/}
                                        {/*        onChange={(e) => setRoomType(e.target.value)}*/}
                                        {/*    >*/}
                                        {/*        <option value="">-- Chọn loại phòng --</option>*/}
                                        {/*        {roomTypes.map((type) => (*/}
                                        {/*            <option key={type.id} value={type.id}>*/}
                                        {/*                {type.name}*/}
                                        {/*            </option>*/}
                                        {/*        ))}*/}
                                        {/*    </select>*/}
                                        {/*</div>*/}
                                        {/*<input type="text" className="form-control mb-2" placeholder="Loại nhà" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />*/}
                                        {/*<input type="text" className="form-control mb-2" placeholder="Loại phòng" value={roomType} onChange={(e) => setRoomType(e.target.value)} />*/}
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bedroom" className="mr-2 mb-2 fw-bold">Phòng Ngủ: </label>
                                            <input
                                                type="number"
                                                className="form-control mb-2"
                                                placeholder="Số phòng ngủ"
                                                value={minBedrooms} // cả min và max đều dùng chung giá trị này
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setMinBedrooms(value);
                                                    setMaxBedrooms(value); // cập nhật cả maxBedrooms
                                                }}
                                            />
                                        </div>


                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bathroom" className="mr-2 mb-2 fw-bold">Phòng Tắm: </label>
                                            <input
                                                type="number"
                                                className="form-control mb-2"
                                                placeholder="Số phòng tắm"
                                                value={minBathrooms} // cả min và max đều dùng chung giá trị này
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setMinBathrooms(value);
                                                    setMaxBathrooms(value); // cập nhật cả maxBathrooms
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="price" className="mr-2 mb-2 fw-bold">Giá: </label>
                                            {/* Thanh kéo cho giá */}
                                            <Slider
                                                value={priceRange}
                                                onChange={(event, newValue) => setPriceRange(newValue)}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={10000000} // Giới hạn tối đa là 10 triệu VNĐ
                                                step={100000}
                                                marks={[
                                                    {value: 0, label: '0 VNĐ'},
                                                    {value: 5000000, label: '5 triệu VNĐ'},
                                                    {value: 10000000, label: '10 triệu VNĐ'}
                                                ]}
                                            />
                                            <p>Giá từ {priceRange[0].toLocaleString()} VNĐ
                                                đến {priceRange[1].toLocaleString()} VNĐ</p>
                                        </div>


                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="dateRange" className="mr-2 mb-2 fw-bold">Chọn khoảng thời
                                                gian:</label>
                                            <div className="d-flex flex-column">
                                                <label htmlFor="startDate" className="mb-1">Từ ngày:</label>
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    value={checkInDate}
                                                    onChange={(e) => setCheckInDate(e.target.value)}
                                                />
                                                <label htmlFor="endDate" className="mb-1">Đến ngày:</label>
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    value={checkOutDate}
                                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-lg-9 ">
                                <div className="row g-4 justify-content-center">
                                    {properties.length === 0 ? (
                                        <p>Không có sản phẩm phù hợp</p>
                                    ) : (
                                        properties.map((property) => (
                                            <div className="col-md-6 col-lg-6 col-xl-4" key={property.id}>
                                                <div className="rounded shadow position-relative property-item">
                                                    <div className="property-img">
                                                        <Link to={`/property/detail/${property.id}`}>
                                                            <img
                                                                style={{
                                                                    width: '100%',
                                                                    height: '250px',
                                                                    objectFit: 'cover',
                                                                    borderTopLeftRadius: '0.375rem',
                                                                    borderTopRightRadius: '0.375rem'
                                                                }}
                                                                src={
                                                                    property.imageUrls.length > 0
                                                                        ? property.imageUrls[0]
                                                                        : "https://firebasestorage.googleapis.com/v0/b/home-dn.appspot.com/o/biet-thu-2.jpg?alt=media&token=5fbefe7b-8a85-488a-9f53-b6be11fcaece"
                                                                }
                                                                alt="Property Image"
                                                                className="img-fluid w-100"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div
                                                        className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                                        style={{ top: '10px', left: '10px', opacity: '0.8' }}>
                                                        {property.propertyType}
                                                    </div>
                                                    <div className="p-4 border border-secondary border-top-0 rounded-bottom bg-light">
                                                        <h5 className="property-name">{property.name}</h5>
                                                        <h6 className="property-address">{property.address}</h6>
                                                        <h6 className="property-room-type text-muted">{property.roomType}</h6>
                                                        <h6 className="property-details text-muted">{property.bedrooms} Phòng Ngủ - {property.bathrooms} Phòng Tắm</h6>
                                                        <div className="d-flex justify-content-between flex-lg-wrap">
                                                            <p className="text-dark fs-5 fw-bold mb-0  property-price">
                                                                {property.pricePerNight.toLocaleString()} VNĐ/Đêm
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>


                                {/* Pagination */}
                                {/*<div className="col-12 d-flex justify-content-center">*/}
                                {/*    <div className="pagination mt-5">*/}
                                {/*        <ul className="pagination justify-content-center">*/}
                                {/*            /!* Logic phân trang ở đây *!/*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyList;