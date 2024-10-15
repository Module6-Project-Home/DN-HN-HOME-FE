import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Button, Modal } from "antd";
import { InfoCircleOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm lấy thông tin người dùng chi tiết
    const fetchUserDetail = async (userId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/admin/user-detail?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserDetail(response.data);
        } catch (error) {
            setError('Có lỗi xảy ra khi tải thông tin người dùng.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/admin/users`, {
                params: { page: currentPage, size: 5 },
                headers: {
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/admin/update-status`, null, {
                params: { userId, status: newStatus },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers(page);
        } catch (error) {
            console.error('Error updating status:', error.response ? error.response.data : error.message);
            alert('Failed to update status. Please try again later.');
        }
    };

    const handleInfoClick = (userId) => {
        fetchUserDetail(userId);
        setShowModal(true);
    };

    const approveUser = async (userId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/admin/approve-upgrade`, null, {
                params: { userId, isApproved: true },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(users.map(user => user.userId === userId ? { ...user, isApproved: true } : user));
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const denyUser = async (userId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/admin/deny-upgrade`, null, {
                params: { userId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(users.map(user => user.userId === userId ? { ...user, isApproved: false } : user));
        } catch (error) {
            console.error('Error denying user:', error);
        }
    };

    const handleViewHistory = (userId, fullName) => {
        navigate(`/admin/user-detail/${userId}`, {state: {fullName}});
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
                                    <Button color="default" variant="text" style={{ marginLeft: '10px' }}
                                            onClick={() => handleInfoClick(user.userId)} icon={<InfoCircleOutlined />}>
                                    </Button>
                                </td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.status === 'ACTIVE'?'Đang hoạt động':'Khoá'}</td>
                                <td>
                                    {user.status === 'ACTIVE' ? (
                                        <Button type="primary" icon={<LockOutlined />} style={{ backgroundColor: 'indianred' }}
                                                onClick={() => handleStatusChange(user.userId, 'SUSPENDED')}>Khoá</Button>
                                    ) : (
                                        <Button type="primary" icon={<UnlockOutlined />} style={{ backgroundColor: 'cornflowerblue' }}
                                                onClick={() => handleStatusChange(user.userId, 'ACTIVE')}>Mở Khoá</Button>
                                    )}
                                </td>
                                <td>
                                    {user.upgradeRequested && (
                                        <div id="approval-buttons">
                                            <Button color="default" variant="outlined" id="approve-button" onClick={() => approveUser(user.userId)}>Duyệt</Button>
                                            <Button color="default" variant="dashed" id="deny-button" onClick={() => denyUser(user.userId)}>Từ chối</Button>
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
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    breakClassName={'page-item'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link '}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                    disabledClassName={'disabled'}
                />
            </div>
            <Modal
                title="Thông tin chi tiết"
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button key="close" onClick={() => setShowModal(false)}>Đóng</Button>
                ]}
            >
                {loading ? (
                    <p>Loading user details...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : userDetail && (
                    <div>
                        <div className="text-center">
                            <img src={userDetail.avatar} alt="Avatar" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                        </div>
                        <p><strong>Username:</strong> {userDetail.username}</p>
                        <p><strong>Họ và tên:</strong> {userDetail.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {userDetail.phoneNumber}</p>
                        <p><strong>Trạng thái:</strong> {userDetail.userStatus === 1 ? 'Đang hoạt động' : 'Khoá'}</p>
                        <p><strong>Số tiền đã chi tiêu:</strong> {userDetail.totalSpent.toLocaleString()} Đ</p>
                        <Button type="primary" onClick={() => handleViewHistory(userDetail.id, userDetail.fullName)}>Xem Lịch Sử Thuê Nhà</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserTable;
