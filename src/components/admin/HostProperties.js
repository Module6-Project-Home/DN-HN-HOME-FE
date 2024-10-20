import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useLocation, useParams} from 'react-router-dom';
import { Button, Table } from 'antd';
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";

const HostProperties = () => {
    const { hostId } = useParams();
    const location = useLocation();
    const {fullName} = location.state || {};
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/api/admin/host-properties`, {
                    params: { hostId },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('API Response:', response.data); // Debugging log
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [hostId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusInVietnamese = (status) => {
        switch (status) {
            case 'RENTED':
                return 'đang cho thuê';
            case 'VACANT':
                return 'còn trống';
            case 'MAINTENANCE':
                return 'bảo trì';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: 'Tên nhà',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Giá mỗi đêm',
            dataIndex: 'pricePerNight',
            key: 'pricePerNight',
            render: (text) => formatCurrency(text),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => getStatusInVietnamese(text),
        },



        // Add more columns as needed
    ];

    return (
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin/>
                <div id="layoutSidenav">
                    <SidebarAdmin/>
                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container-fluid px-4">
                                <h2>Danh sách nhà cho thuê của {fullName}</h2>
                                <Table
                                    dataSource={properties}
                                    columns={columns}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={false}
                                />
                                <Button onClick={() => window.history.back()}>Quay lại</Button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
                            </div>
                            );
                            };

                            export default HostProperties;