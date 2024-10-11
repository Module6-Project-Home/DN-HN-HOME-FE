import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import {Button, Modal, Pagination} from "antd";
import {ModalBody, ModalFooter, ModalHeader, ModalTitle} from "react-bootstrap";
import {InfoCircleOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
// import {Button, Modal} from "react-bootstrap";


const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
            const response = await axios.get(`http://localhost:8080/api/admin/users`, {
                params: {page: currentPage, size: 5},
                headers: {
                    'Authorization': `Bearer ${token}` // Thêm token vào header
                }
            });
            setUsers(response.data.content);
            setPageCount(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };
    const handlePageClick = (data) => {
        setPage(data.selected);
        fetchUsers(data.selected);
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get token from localStorage
            await axios.put(`http://localhost:8080/api/admin/update-status`, null, {
                params: {userId, status: newStatus},
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to header
                }
            });
            fetchUsers(page);
        } catch (error) {
            console.error('Error updating status:', error.response ? error.response.data : error.message);
            alert('Failed to update status. Please try again later.');
        }
    };
    const handleInfoClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const approveUser = async (userId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Token not found');
            }
            console.log('Approving user with ID:', userId);
            await axios.put(`http://localhost:8080/api/admin/approve-upgrade`, null, {
                params: { userId, isApproved: true },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('User approved');
            setUsers(users.map(user => user.userId === userId ? { ...user, isApproved: true } : user));
            // fetchUsers(page);
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const denyUser = async (userId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Token not found');
            }
            console.log('Denying user with ID:', userId);
            await axios.put(`http://localhost:8080/api/admin/deny-upgrade`, null, {
                params: { userId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('User denied');
            setUsers(users.map(user => user.userId === userId ? { ...user, isApproved: false } : user));

            // fetchUsers(page);
        } catch (error) {
            console.error('Error denying user:', error);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    return (
        <div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th>Họ & Tên</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.fullName}
                                    <Button color="default" variant="text" style={{marginLeft: '10px'}}
                                            onClick={() => handleInfoClick(user)} icon={<InfoCircleOutlined />}>
                                    </Button>
                                </td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.status}</td>
                                <td>

                                    {user.status === 'ACTIVE' ? (
                                        <Button type="primary" icon={<LockOutlined />} style={{backgroundColor: 'indianred'}}
                                                onClick={() => handleStatusChange(user.userId, 'SUSPENDED')}>Khoá</Button>
                                    ) : (
                                        <Button type="primary" icon={<UnlockOutlined />} style={{backgroundColor: 'cornflowerblue'}}
                                                onClick={() => handleStatusChange(user.userId, 'ACTIVE')}>Mở
                                            Khoá</Button>
                                    )}
                                </td>
                                <td>
                                    {user.upgradeRequested && (
                                        <div id="approval-buttons">
                                            <button id="approve-button" onClick={() => approveUser(user.userId)}>Duyệt
                                            </button>
                                            <button id="deny-button" onClick={() => denyUser(user.userId)}>Từ chối
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div>
                <Pagination
                    align="center"
                    defaultCurrent={1}
                    total={pageCount}
                    onChange={handlePageClick}
                /></div>
            <Modal
                title="Thông tin chi tiết"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button key="close" onClick={() => setShowModal(false)}>Đóng</Button>
                ]}
            >
                {selectedUser && (
                    <div>
                        <div className="text-center">
                            <img src={selectedUser.avatar} alt="Avatar" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                        </div>
                        <p><strong>Username:</strong> {selectedUser.userName}</p>
                        <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        <p><strong>Số tiền đã chi tiêu:</strong></p>
                        <p><strong>Lịch sử thuê nhà:</strong></p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserTable;