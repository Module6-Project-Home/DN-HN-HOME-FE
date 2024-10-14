import React, { useEffect } from 'react';
import { Tab, Nav, Row, Col, Alert } from 'react-bootstrap';
import AdminLayout from './AdminLayout';
import UserTable from './UserTable';
import HostTable from './HostTable';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get('token');

            if (token) {
                localStorage.setItem('token', token); // Lưu token vào localStorage
                // Bạn có thể thêm logic xác thực thêm ở đây nếu cần
            } else {
                navigate('/login'); // Nếu không có token, chuyển hướng về trang đăng nhập
            }
        };

        validateToken();
    }, [navigate]);

    return (
        <AdminLayout>
            <div>
                <h1 style={{ marginTop: '70px' }}>Admin Dashboard</h1>
                <Tab.Container defaultActiveKey="userTable">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="userTable">Người dùng</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="hostTable">Chủ nhà</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="userTable">
                                    <UserTable />
                                </Tab.Pane>
                                <Tab.Pane eventKey="hostTable">
                                    <HostTable />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
