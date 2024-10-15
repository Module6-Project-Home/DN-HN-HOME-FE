import React, { useEffect } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import AdminLayout from './AdminLayout';
import UserTable from './UserTable';
import HostTable from './HostTable';
import {useLocation, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {useAuth} from "../auth/AuthContext";

const AdminDashboard = () => {
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

    return (
        <AdminLayout>
            <div className="card mt-5" >
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