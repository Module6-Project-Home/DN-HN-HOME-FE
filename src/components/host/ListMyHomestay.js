import React, {useEffect, useState} from 'react';
import axios from "axios";
import HeroBanner from "../property/HeroBanner";
import {useLocation} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {jwtDecode} from "jwt-decode";


const ListMyHomestay = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState('');
    const location = useLocation();
    const hostName = location.state?.hostName||'';

    const { login } = useAuth();
    // Function to get token from query string
    const getQueryParams = (urlSearchParams) => {
        const params = new URLSearchParams(urlSearchParams);
        return params.get('token'); // Get token value
    };
    const tokenFromParams = getQueryParams(location.search);
    console.log('tokenFromParams', tokenFromParams);


    useEffect(() => {
        const fetchUser = async () => {
            if (tokenFromParams) {
                const decoded = jwtDecode(tokenFromParams);
                const username = decoded.sub;
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/findByUsername?username=${username}`);
                    console.log(response.data, 'response');
                    const { roles, id } = response.data;
                    const rolesArr = roles.map(role => role.name);
                    // Gọi login để cập nhật context
                    login(username, rolesArr, id, tokenFromParams);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        let jwtToken = localStorage.getItem("jwtToken"); // Lấy token từ localStorage
        if (!jwtToken) {
            setError("JWT token is missing.");
            console.error("JWT token is missing.");
            return;
        }

        // Gọi API để lấy danh sách tài sản của chủ nhà
        axios.get(`http://localhost:8080/api/host/listMyHomestay`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`, // Gửi token ở đây
                'Content-Type': 'application/json', // Thêm Content-Type nếu cần
            },
        })
            .then(response => {
                setProperties(response.data); // Gán dữ liệu vào state
            })
            .catch(error => {
                setError("Không thể tải danh sách tài sản."); // Xử lý lỗi
                console.error("Lỗi khi lấy danh sách tài sản", error);
            });
    }, []);
    return (
        <div className="table-responsive">
            <HeroBanner></HeroBanner>
            {hostName && <h2>Danh sách nhà của {hostName}</h2>} {/* Hiển thị tên chủ nhà */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Tên nhà</th>
                    <th>Địa chỉ</th>
                    <th>Giá mỗi đêm</th>
                    <th>Số phòng ngủ</th>
                    <th>Số phòng tắm</th>
                    <th>Loại tài sản</th>
                    <th>Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {properties.length > 0 ? (
                    properties.map((property, index) => (
                        <tr key={property.id}>
                            <td>{index + 1}</td>
                            <td>{property.name}</td>
                            <td>{property.address}</td>
                            <td>{property.pricePerNight}</td>
                            <td>{property.bedrooms}</td>
                            <td>{property.bathrooms}</td>
                            <td>{property.propertyType}</td>
                            <td>{property.status}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center">Không có tài sản nào để hiển thị</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ListMyHomestay;
