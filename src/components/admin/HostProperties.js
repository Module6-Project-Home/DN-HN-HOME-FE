import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useLocation, useParams} from 'react-router-dom';
import {Button, Table, Tag} from 'antd';
import Header from "../property/Header";

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
                return (<Tag color='#69b1ff'>Đang cho thuê</Tag>);
            case 'VACANT':
                return (<Tag color='lime'>Còn trống</Tag>);
            case 'MAINTENANCE':
                return (<Tag color='#d46b08'>Bảo trì</Tag>);;
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
            <Header/>
                                <h2 style={{marginTop:'100px'}}>Danh sách nhà cho thuê của {fullName}</h2>
                                <Table
                                    dataSource={properties}
                                    columns={columns}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={false}
                                />
                                <Button type='primary' style={{backgroundColor:'#001d66'}} onClick={() => window.history.back()}>Quay lại</Button>

                            </div>
                            );
                            };

                            export default HostProperties;