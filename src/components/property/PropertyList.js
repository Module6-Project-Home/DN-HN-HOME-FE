import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroBanner from "./HeroBanner";
import {useLocation} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../auth/AuthContext";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
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
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const { login } = useAuth();
    const location = useLocation();

    // Hàm để lấy tham số từ query string
    const getQueryParams = (urlSearchParams) => {
        const params = new URLSearchParams(urlSearchParams);
        return params.get('token'); // Lấy giá trị của token
    };

    const tokenFromParams = getQueryParams(location.search);
    console.log('tokenFromParams', tokenFromParams);

    // TODO: Decode token để lấy thông tin username, sau đó gọi API lấy full thông tin user theo username

    useEffect(() => {
        const fetchUser = async  () => {
            const decoded = jwtDecode(tokenFromParams);
            const username = decoded.sub;
            const response = await axios.get("http://localhost:8080/api/users/findByUsername?username=" + username);
            console.log(response.data, 'response');
            const {roles, id} = response.data;
            login(username, roles, id, tokenFromParams);
        }
        if (tokenFromParams) {
            fetchUser();
        }
    }, [tokenFromParams])

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/property-types');
                setPropertyTypes(response.data);
                if (response.data.length > 0) {
                    setPropertyType(response.data[0].id); // Use the id for the selected type
                }
            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/room-types');
                setRoomTypes(response.data);
                if (response.data.length > 0) {
                    setRoomType(response.data[0].id); // Use the id for the selected room type
                }
            } catch (error) {
                console.error('Error fetching room types:', error);
            }
        };

        fetchPropertyTypes();
        fetchRoomTypes();
        fetchProperties(); // Optional: Fetch all properties initially if needed
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
            alert('Error fetching properties. Please try again later.'); // Alert user on error
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();

        // Optional: reset the form fields after search
        setName('');
        setAddress('');
        setMinPrice('');
        setMaxPrice('');
        setPropertyType('');
        setRoomType('');
        setMinBedrooms('');
        setMaxBedrooms('');
        setMinBathrooms('');
        setMaxBathrooms('');
        setCheckInDate('');
        setCheckOutDate('');
    };

    return (
        <div className="container-fluid fruite py-5">
            <HeroBanner />
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
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="address" className="mr-2 mb-2 fw-bold">Địa chỉ: </label>
                                            <input id="address" type="text" className="form-control mb-2" placeholder="Địa chỉ"
                                                   value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="propertyType" className="mr-2 mb-2 fw-bold">Loại Nhà: </label>
                                            <select
                                                id="propertyType"
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
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bedroom" className="mr-2 mb-2 fw-bold">Phòng Ngủ: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng ngủ tối thiểu" value={minBedrooms}
                                                   onChange={(e) => setMinBedrooms(e.target.value)} />
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng ngủ tối đa" value={maxBedrooms}
                                                   onChange={(e) => setMaxBedrooms(e.target.value)} />
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="bathroom" className="mr-2 mb-2 fw-bold">Phòng Tắm: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng tắm tối thiểu" value={minBathrooms}
                                                   onChange={(e) => setMinBathrooms(e.target.value)} />
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Số phòng tắm tối đa" value={maxBathrooms}
                                                   onChange={(e) => setMaxBathrooms(e.target.value)} />
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="price" className="mr-2 mb-2 fw-bold">Giá: </label>
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Giá tối thiểu" value={minPrice}
                                                   onChange={(e) => setMinPrice(e.target.value)} />
                                            <input type="number" className="form-control mb-2"
                                                   placeholder="Giá tối đa" value={maxPrice}
                                                   onChange={(e) => setMaxPrice(e.target.value)} />
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="checkIn" className="mr-2 mb-2 fw-bold">Ngày Nhận Phòng: </label>
                                            <input type="date" className="form-control mb-2"
                                                   value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                                        </div>
                                        <div className="form-group mr-2 mb-3">
                                            <label htmlFor="checkOut" className="mr-2 mb-2 fw-bold">Ngày Trả Phòng: </label>
                                            <input type="date" className="form-control mb-2"
                                                   value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Tìm Kiếm</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="mb-4">Danh sách bất động sản</h3>
                <div className="row">
                    {properties.length === 0 ? (
                        <p>Không tìm thấy bất động sản nào.</p>
                    ) : (
                        properties.map((property) => (
                            <div className="col-lg-4 mb-4" key={property.id}>
                                <div className="card">
                                    <img src={property.imageUrl} alt={property.name} className="card-img-top" />
                                    <div className="card-body">
                                        <h5 className="card-title">{property.name}</h5>
                                        <p className="card-text">Giá: {property.price} VND</p>
                                        <p className="card-text">Địa chỉ: {property.address}</p>
                                        <a href={`/properties/${property.id}`} className="btn btn-primary">Chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyList;
