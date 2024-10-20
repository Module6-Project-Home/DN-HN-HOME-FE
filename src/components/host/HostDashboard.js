import React, { useEffect, useState } from 'react';

import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import { Link } from "react-router-dom";


import {useLocation} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const HostDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(''); // Tìm kiếm theo tên nhà
    const [searchStatus, setSearchStatus] = useState(''); // Tìm kiếm theo trạng thái
    const location = useLocation();
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
        const jwtToken = localStorage.getItem("jwtToken");

        axios.get('http://localhost:8080/api/host/revenue', {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log("Dữ liệu trả về từ API:", response.data); // Kiểm tra dữ liệu
                setProperties(response.data);
            })
            .catch(error => {
                setError("Không thể tải danh sách tài sản.");
                console.error("Lỗi khi lấy danh sách tài sản", error);
            });
    }, []);

    // Tính toán chỉ số của mục đầu tiên và cuối cùng
    const indexOfLastProperty = currentPage * itemsPerPage;
    const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;

    useEffect(() => {
        setCurrentPage(1); // Đặt lại về trang 1 khi thay đổi
    }, [searchTerm, itemsPerPage]);

    // Lọc tài sản theo tên và trạng thái
    const filteredProperties = properties.filter(property => {
        return (
            property.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (searchStatus === '' || property.status === searchStatus)
        );
    });

    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Đặt lại về trang 1 khi thay đổi số lượng mục trên mỗi trang
    };

    const handleStatusChange = async (propertyId, newStatus) => {
        console.log('propertyId', propertyId);
        console.log('newStatus', newStatus);
        const property = properties.find(p => p.id === propertyId);
        console.log(property);
        if (property.status === 'RENTED') {
            alert('Không thể thay đổi trạng thái khi nhà đang cho thuê.');
            return;
        }
        console.log('property', property);
        const confirmChange = window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái?');
        if (confirmChange) {
            try {
                const jwtToken = localStorage.getItem("jwtToken");
                console.log('jwtToken', jwtToken);
                const response = await axios.put(`http://localhost:8080/api/properties/change-status/${propertyId}`, null, {
                    params: { newStatus },
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                console.log('response', response.data);

                if (response.status === 200) {
                    const updatedProperty = response.data;
                    console.log('updatedProperty', updatedProperty);
                    setProperties(properties.map(p => p.id === propertyId ? {...p,status:newStatus} : p));
                    console.log(properties[0].status);
                }else if(response.status==400){
                    alert('Không thể thay đổi trạng thái khi nhà đang cho thuê.');
                } else{
                    alert('Có lỗi xảy ra khi thay đổi trạng thái.');
                }
            } catch (error) {
                if (error && error.status === 400) {
                    alert('Không thể thay đổi trạng thái khi nhà đang cho thuê.');
                } else {
                        console.error('Lỗi khi thay đổi trạng thái:', error);
                    alert('Có lỗi xảy ra khi thay đổi trạng thái.');
                }
            }
        }
    };


    return (
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div id="layoutSidenav">
                    <SidebarAdmin />
                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container-fluid px-4 ">
                                <h1 className="mt-4">Quản lý nhà</h1>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item">
                                        <Link to="/host/dashboard">Tổng quan</Link>
                                    </li>

                                </ol>
                                <div className="mt-5">
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tìm kiếm theo tên nhà"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <select
                                                className="form-control"
                                                value={searchStatus}
                                                onChange={(e) => setSearchStatus(e.target.value)}
                                            >
                                                <option value="">Tất cả trạng thái</option>
                                                <option value="VACANT">Đang trống</option>
                                                <option value="RENTED">Đang cho thuê</option>
                                                <option value="MAINTENANCE">Đang bảo trì</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3 d-flex align-items-center">
                                        <label htmlFor="itemsPerPage" className="form-label mb-0 me-2">Số mục trên mỗi trang:</label>
                                        <select
                                            id="itemsPerPage"

                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mx-auto">
                                            <div className="d-flex justify-content-between">
                                                <Link to="/host/create-property" className="btn btn-primary">Thêm nhà mới</Link>
                                                <Link to="/host/history" className="btn btn-primary">Quản lý cho thuê</Link>
                                            </div>

                                            <hr />
                                            <table className="table table-bordered table-hover">
                                                <thead className="thead-dark">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tên nhà</th>
                                                    <th>Địa chỉ</th>
                                                    <th>Giá mỗi đêm</th>
                                                    <th>Trạng thái</th>
                                                    <th>Doanh thu</th>
                                                    <th>Hành động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentProperties.length > 0 ? (
                                                    currentProperties.map((property, index) => (
                                                        <tr key={property.id}>
                                                            <td>{indexOfFirstProperty + index + 1}</td>
                                                            <td>{property.name}</td>
                                                            <td>{property.address}</td>
                                                            <td>{property.pricePerNight.toLocaleString()} VNĐ</td>
                                                            <td>
                                                                <select
                                                                    value={property.status}
                                                                    onChange={(e) => handleStatusChange(property.id, e.target.value)}
                                                                    disabled={property.status === 'RENTED'}
                                                                >
                                                                    <option value="VACANT">Đang trống</option>
                                                                    <option value="RENTED">Đang cho thuê</option>
                                                                    <option value="MAINTENANCE">Đang bảo trì</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                {property.revenue} VNĐ
                                                            </td>
                                                            <td>


                                                                <Link to={`/host/update-property/${property.id}`}
                                                                      className="btn btn-warning bi bi-save"> Chỉnh
                                                                    Sửa</Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-center">Không có tài sản nào để
                                                            hiển thị
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>

                                            {/* Nút phân trang */}
                                            <nav className="d-flex justify-content-between align-items-center my-3">
                                                <button
                                                    onClick={goToPreviousPage}
                                                    className="btn btn-primary"
                                                    disabled={currentPage === 1}
                                                >
                                                    Trang trước
                                                </button>

                                                <ul className="pagination mb-0">
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                                {i + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    onClick={goToNextPage}
                                                    className="btn btn-primary"
                                                    disabled={currentPage === totalPages || totalPages === 0}
                                                >
                                                    Trang sau
                                                </button>
                                            </nav>

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
