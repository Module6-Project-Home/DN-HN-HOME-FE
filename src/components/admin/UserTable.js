// src/components/UserTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import {Button, Modal} from "react-bootstrap";


const  UserTable = () => {
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
                params: { page: currentPage, size: 5 },
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
                params: { userId, status: newStatus },
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to header
                }
            });
            // const handleInfoClick = (user) => {
            //     setSelectedUser(user);
            //     setShowModal(true);
            // };
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

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Họ & Tên</th>
                        <th>SĐT</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.fullName}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.status}</td>
                            <td>
                                <button type="button" className="btn btn-info"
                                        onClick={() => handleInfoClick(user)}>Info
                                </button>
                                {user.status === 'ACTIVE' ? (
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleStatusChange(user.userId, 'SUSPENDED')}>Khoá</button>
                                ) : (
                                    <button type="button" className="btn btn-success"
                                            onClick={() => handleStatusChange(user.userId, 'ACTIVE')}>Mở Khoá</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'page-item'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                activeClassName={'active'}
                disabledClassName={'disabled'}
            />
            {selectedUser && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thông tin chi tiết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <img src={selectedUser.avatar} alt="Avatar" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                        </div>
                        <p><strong>Username:</strong> {selectedUser.userName}</p>
                        <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        <p><strong>Số tiền đã chi tiêu:</strong> </p>
                        <p><strong>Lịch sử thuê nhà:</strong> </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default UserTable;