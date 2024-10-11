import React, {useEffect, useState} from 'react';
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import {Link} from "react-router-dom";
import axios from "axios";

const HostDashboard = () => {
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
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div id="layoutSidenav">
                    <SidebarAdmin />
                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container-fluid px-4">
                                <h1 className="mt-4">Quản lý nhà</h1>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item">
                                        <Link to="/admin">Tổng quan</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Nhà</li>
                                </ol>
                                <div className="mt-5">
                                    <div className="row">
                                        <div className="col-12 mx-auto">
                                            <div className="d-flex justify-content-between">
                                                <Link to="/admin/property/create" className="btn btn-primary">Thêm nhà mới</Link>
                                                <Link to="/admin/property/history" className="btn btn-primary">Quản lý cho thuê</Link>
                                            </div>

                                            <hr />
                                            <table className="table table-bordered table-hover">
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

                                            {/*<div>*/}
                                            {/*    <Link to={`/admin/property?page=${properties.number - 1}`} className="btn btn-primary"*/}
                                            {/*          style={{ visibility: properties.hasPrevious ? 'visible' : 'hidden' }}>*/}
                                            {/*        Previous*/}
                                            {/*    </Link>*/}
                                            {/*    <span>{properties.number + 1}</span> | <span>{properties.totalPages}</span>*/}
                                            {/*    <Link to={`/admin/property?page=${properties.number + 1}`} className="btn btn-primary"*/}
                                            {/*          style={{ visibility: properties.hasNext ? 'visible' : 'hidden' }}>*/}
                                            {/*        Next*/}
                                            {/*    </Link>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
