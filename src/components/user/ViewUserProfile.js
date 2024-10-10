import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewUserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                setUserProfile(response.data); // Set the user profile data
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

    return (
        <div className="container mt-5 custom-margin">
            <h2>Quản lý tài khoản</h2>
            <p>{error}</p>
            <div className="card p-3">
                <h5>Thông tin cá nhân:</h5>
                <p><strong>Tên người dùng:</strong> {userProfile.username}</p>
                <p><strong>Họ và tên:</strong> {userProfile.fullName}</p>
                <p><strong>Địa chỉ:</strong> {userProfile.address}</p>
                {/* Hiển thị các thông tin khác của người dùng nếu cần */}
            </div>
        </div>
    );
};

export default ViewUserProfile;