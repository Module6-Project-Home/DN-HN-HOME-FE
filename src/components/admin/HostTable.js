import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import {Button, Modal} from "react-bootstrap";
import {Button, Modal, Pagination} from "antd";
import {ExclamationCircleOutlined, InfoCircleOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
import ReactPaginate from "react-paginate";
import PropertyCount from "../host/PropertyCount";
import { useNavigate } from 'react-router-dom';



const { confirm } = Modal; //tạo hộp thoại xác nhận

const  HostTable = () => {
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
        try {
            const token = localStorage.getItem('jwtToken'); // Get token from localStorage
            await axios.put(`http://localhost:8080/api/admin/update-status`, null, {
                params: { userId, status: newStatus },
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

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();

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
                        <tr key={user.userId}>
                            <td>{user.fullName}
                                <Button color="default" variant="text" style={{marginLeft: '10px'}}
                                        onClick={() => handleInfoClick(user)} icon={<InfoCircleOutlined />}>
                                </Button>
                            </td>
                            <td>{user.phoneNumber}</td>
                            <td></td>
                            <td><PropertyCount ownerId={user.userId} token={token}/></td>
                            <td>{user.status === 'ACTIVE'?'Đang hoạt động':'Khoá'}</td>
                            <td>

                                {user.status === 'ACTIVE' ? (
                                    <Button type="primary" icon={<LockOutlined />} style={{ backgroundColor: 'indianred' }}
                                            onClick={() => showConfirmLock(user.userId)}>Khoá</Button>
                                ) : (
                                    <Button type="primary" icon={<UnlockOutlined />} style={{ backgroundColor: 'cornflowerblue' }}
                                            onClick={() => showConfirmUnlock(user.userId)}>Mở Khoá</Button>
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
                            <img src={selectedUser.avatar} alt="Avatar" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                        </div>
                        <p><strong>Username:</strong> {selectedUser.userName}</p>
                        <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
                        <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        <p><strong>Tổng doanh thu:</strong> </p>
                        {/*<p><strong>Danh sách nhà đang cho thuê:</strong> </p>*/}
                    <Button type="primary" onClick={() => navigate('/host/listMyHome',{state:{hostName:selectedUser.fullName}})}>
                        Danh sách nhà đang cho thuê
                    </Button>
                </div>
            )}
                </Modal>
        </div>
    );
};

export default HostTable;