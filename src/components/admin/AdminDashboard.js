import React from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import AdminLayout from './AdminLayout';
import UserTable from './UserTable';
import HostTable from './HostTable';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div>
                <h1 style={{ marginTop: '70px' }}>Admin Dashboard</h1>
                <Tab.Container defaultActiveKey="userTable">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link to="http://localhost:8080/api/admin/users" eventKey="userTable">Người dùng</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link to="http://localhost:8080/api/admin/hosts" eventKey="hostTable">Chủ nhà</Nav.Link>
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