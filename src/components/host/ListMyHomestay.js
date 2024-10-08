import React, {useEffect, useState} from 'react';
import axios from "axios";
import HeroBanner from "../property/HeroBanner";

const ListMyHomestay = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let jwtToken = localStorage.getItem("jwtToken");

        // Gọi API để lấy danh sách tài sản của chủ nhà
        axios.get('http://localhost:8080/api/host/listMyHomestay', {
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
