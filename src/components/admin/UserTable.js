import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Table, notification, Spin, Input } from 'antd';
import ReactPaginate from 'react-paginate';
import { InfoCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reason, setReason] = useState(''); // State to store the reason for upgrade decision
    const [isApprove, setIsApprove] = useState(null); // State to determine if the action is approve or deny

    // Fetch users with pagination
    const fetchUsers = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                params: { page: currentPage, size: 5 },
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setUsers(response.data.content);
            setPageCount(response.data.totalPages);
        } catch (error) {
            notification.error({
                message: 'Lỗi khi lấy danh sách người dùng',
                description: error.response?.data?.message || 'Không thể lấy dữ liệu',
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination click
    const handlePageClick = (data) => {
        setPage(data.selected);
        fetchUsers(data.selected);
    };

    // Change user status (lock/unlock)
    const handleStatusChange = async (userId, newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put('http://localhost:8080/api/admin/update-status', null, {
                params: { userId, status: newStatus },
                headers: { 'Authorization': `Bearer ${token}` },
            });
            notification.success({
                message: 'Cập nhật trạng thái thành công',
                description: `Trạng thái người dùng đã được cập nhật thành ${newStatus}`,
            });
            fetchUsers(page); // Refresh users after status update
        } catch (error) {
            notification.error({
                message: 'Lỗi khi cập nhật trạng thái',
                description: error.response?.data?.message || 'Không thể cập nhật trạng thái',
            });
        } finally {
            setLoading(false);
        }
    };

    // Show user details in modal
    const handleInfoClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Prepare to handle upgrade decision
    const openDecisionModal = (userId, approve) => {
        setIsApprove(approve);
        setSelectedUser(userId);
        setShowModal(true);
        setReason(''); // Reset the reason input field
    };

    // Approve or deny upgrade requests
    const handleUpgradeDecision = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const endpoint = isApprove
                ? 'http://localhost:8080/api/admin/approve-upgrade'
                : 'http://localhost:8080/api/admin/deny-upgrade';

            // Send the request to the appropriate endpoint
            await axios.put(endpoint, null, {
                params: { userId: selectedUser, isApproved: isApprove, reason },
                headers: { 'Authorization': `Bearer ${token}` },
            });

            // Notify success based on the action
            notification.success({
                message: isApprove ? 'Duyệt thành công' : 'Từ chối thành công',
                description: `Yêu cầu nâng cấp đã được ${isApprove ? 'duyệt' : 'từ chối'}`,
            });

            // Refresh user list
            fetchUsers(page);
        } catch (error) {
            // Notify error if something goes wrong
            notification.error({
                message: `Lỗi khi ${isApprove ? 'duyệt' : 'từ chối'} yêu cầu`,
                description: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
            setShowModal(false); // Close the modal after the decision is made
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    return (
        <div>
            {loading ? (
                <Spin size="large" tip="Loading..." />
            ) : (
                <Table
                    dataSource={users}
                    rowKey="userId"
                    pagination={false}
                    columns={[
                        {
                            title: 'Họ & Tên',
                            dataIndex: 'fullName',
                            key: 'fullName',
                            render: (text, user) => (
                                <span>
                                    {text}{' '}
                                    <Button
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => handleInfoClick(user)}
                                        size="small"
                                    />
                                </span>
                            ),
                        },
                        { title: 'SĐT', dataIndex: 'phoneNumber', key: 'phoneNumber' },
                        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                        {
                            title: 'Hành động',
                            key: 'action',
                            render: (user) => (
                                <div>
                                    {user.status === 'ACTIVE' ? (
                                        <Button
                                            type="primary"
                                            icon={<LockOutlined />}
                                            danger
                                            onClick={() => handleStatusChange(user.userId, 'SUSPENDED')}
                                        >
                                            Khoá
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            icon={<UnlockOutlined />}
                                            onClick={() => handleStatusChange(user.userId, 'ACTIVE')}
                                        >
                                            Mở Khoá
                                        </Button>
                                    )}
                                    {user.upgradeRequested && (
                                        <div style={{ marginTop: 10 }}>
                                            <Button
                                                type="primary"
                                                onClick={() => openDecisionModal(user.userId, true)}
                                                style={{ marginRight: 5 }}
                                            >
                                                Duyệt
                                            </Button>
                                            <Button
                                                danger
                                                onClick={() => openDecisionModal(user.userId, false)}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            )}

            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
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

            <Modal
                title="Thông tin chi tiết"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button key="close" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>,
                    (isApprove !== null) && (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleUpgradeDecision}
                            disabled={!reason.trim()} // Disable if reason is empty
                        >
                            {isApprove ? 'Duyệt' : 'Từ chối'}
                        </Button>
                    )
                ]}
            >
                {selectedUser && (
                    <div>
                        <div className="text-center">
                            <img
                                src={selectedUser.avatar}
                                alt="Avatar"
                                className="img-thumbnail"
                                style={{ width: '150px', height: '150px' }}
                            />
                        </div>
                        <p><strong>Username:</strong> {selectedUser.userName}</p>
                        <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        {isApprove !== null && (
                            <div>
                                <Input
                                    placeholder="Nhập lý do"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    style={{ marginTop: 10 }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserTable;
