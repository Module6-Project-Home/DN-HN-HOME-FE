import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Button, Modal, notification, Tag} from "antd";
import {ExclamationCircleOutlined, InfoCircleOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';


const { confirm } = Modal; //tạo hộp thoại xác nhận

const  HostTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();

    const fetchUsers = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
            const response = await axios.get(`http://localhost:8080/api/admin/hosts`, {
                params: { page: currentPage, size: 5 },
                headers: {
                    'Authorization': `Bearer ${token}` // Thêm token vào header
                }
            });
            setUsers(response.data.content);
            setPageCount(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching host:', error);
        } finally {
            setLoading(false);
        }
    };

    const showConfirmLock = (userId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn khoá người dùng này không?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác.',
            onOk() {
                handleStatusChange(userId, 'SUSPENDED');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const showConfirmUnlock = (userId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn mở khoá người dùng này không?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này sẽ kích hoạt lại tài khoản của người dùng.',
            onOk() {
                handleStatusChange(userId, 'ACTIVE');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handlePageClick = (data) => {
        setPage(data.selected);
        fetchUsers(data.selected);
    };



    const handleStatusChange = async (userId, newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put('http://localhost:8080/api/admin/update-status', null, {
                params: {userId, status: newStatus},
                headers: {'Authorization': `Bearer ${token}`},
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
    const handleInfoClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleViewPropertiesClick = (hostId,fullName) => {
        navigate(`/host-properties/${hostId}`, { state: { fullName } });
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);




    const token = localStorage.getItem('jwtToken');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

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
                                            <th>Doanh thu</th>
                                            <th>Số nhà đang cho thuê</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}
                                                    <Button color="default" variant="text" style={{marginLeft: '10px'}}
                                                            onClick={() => handleInfoClick(user)}
                                                            icon={<InfoCircleOutlined/>}>
                                                    </Button>
                                                </td>
                                                <td>{user.phoneNumber}</td>
                                                <td>{user.totalRevenue !== null && user.totalRevenue !== undefined ? formatCurrency(user.totalRevenue) : 'Chưa có doanh thu'}</td>
                                                <td>{user.propertyCount !== null && user.propertyCount !== undefined ? user.propertyCount : 'Chưa có tài sản'}</td>
                                                <td>{user.status === 'ACTIVE' ? (<Tag color="green">Đang hoạt động</Tag>) : (<Tag color="red">Đã khoá</Tag>)}</td>
                                                <td>

                                                    {user.status === 'ACTIVE' ? (
                                                        <Button type="primary" icon={<LockOutlined/>}
                                                                style={{backgroundColor: 'indianred'}}
                                                                onClick={() => showConfirmLock(user.id)}>Khoá</Button>
                                                    ) : (
                                                        <Button type="primary" icon={<UnlockOutlined/>}
                                                                style={{backgroundColor: '#d3f261'}}
                                                                onClick={() => showConfirmUnlock(user.id)}>Mở
                                                            Khoá</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
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
                                    {selectedUser && (
                                        <div>
                                            <div className="text-center">
                                                <img src={selectedUser.avatar} alt="Avatar" className="img-thumbnail"
                                                     style={{width: '150px', height: '150px'}}/>
                                            </div>
                                            <p><strong>Username: </strong> {selectedUser.username}</p>
                                            <p><strong>Họ và tên: </strong> {selectedUser.fullName}</p>
                                            <p><strong>Số điện thoại: </strong> {selectedUser.phoneNumber}</p>
                                            <p><strong>Địa chỉ: </strong> {selectedUser.address}</p>
                                            <p><strong>Trạng thái: </strong> {selectedUser.status = 'ACTIVE'?'Đang hoạt động':'Khoá'}</p>
                                            <p><strong>Tổng doanh thu: </strong>{formatCurrency(selectedUser.totalRevenue)}</p>
                                            <Button type="primary"
                                                    onClick={() => handleViewPropertiesClick(selectedUser.id, selectedUser.fullName)}>Xem
                                                danh sách
                                            </Button>

                                        </div>
                                    )}
                                </Modal>
                            </div>
                            );
                            };

                            export default HostTable;