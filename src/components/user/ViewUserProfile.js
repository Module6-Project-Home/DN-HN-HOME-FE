import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const ViewUserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                setUserProfile(response.data);
            } catch (err) {
                setError('Error fetching user profile');
                console.error('Error fetching user profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!userProfile) {
        return <p>Loading...</p>;
    }

    const handleUpgradeRequest = async () => {
        if (!userProfile || !userProfile.id) {
            console.error('User is not defined or user ID is missing.');
            toast.error('Bạn cần đăng nhập để thực hiện yêu cầu này.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.put('http://localhost:8080/api/users/request-upgrade', null, {
                params: { userId: userProfile.id },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                toast.success('Yêu cầu nâng cấp của bạn đã được gửi thành công!');
                navigate('/success-page');
            }
        } catch (error) {
            console.error('Error sending upgrade request:', error.response ? error.response.data : error.message);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
        }
    };

    return (
        <div className="container mt-5 custom-margin ">
            <br/>
            <br/>
            <h2>Thông tin cá nhân</h2>
            <p>{error}</p>
            <div className="card p-3">
                <div className="">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <td><strong>Tên đăng nhập:</strong></td>
                            <td>{userProfile.username}</td>
                        </tr>
                        <tr>
                            <td><strong>Avatar:</strong></td>
                            <td>
                                <img src={userProfile.avatar} alt="Avatar" className="img-thumbnail"
                                     style={{width: '150px', height: '150px'}}/>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Họ và tên:</strong></td>
                            <td>{userProfile.fullName}</td>
                        </tr>
                        <tr>
                            <td><strong>Địa chỉ:</strong></td>
                            <td>{userProfile.address}</td>
                        </tr>
                        <tr>
                            <td><strong>Số điện thoại:</strong></td>
                            <td>{userProfile.phoneNumber}</td>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <Link to="/profile-update" className="btn btn-primary m-1">
                <i className="fa fa-pen-square"></i>
                Sửa thông tin cá nhân
            </Link>
            <Link to="/change-password" className="btn btn-secondary m-1">
                Đổi mật khẩu
            </Link>
            <button type="button" className="btn btn-warning m-1" onClick={handleUpgradeRequest}>
                Trở thành chủ nhà
            </button>
        </div>
    );
};

export default ViewUserProfile;