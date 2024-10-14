import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import {uploadImageToFirebase} from "../firebaseUpload";

const UpdateUserProfile = () => {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        avatar: '',
        phoneNumber: '',
        address: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let errors = {};

        // Kiểm tra username (chỉ chứa chữ cái và số)
        if (!/[^\w\s]/.test(userProfile.fullName)) {
            errors.fullName = 'Họ tên không được chứa ký tự đặc biệt!';
        }

        // Kiểm tra phone number (10 số và bắt đầu bằng số 0)
        if (!/^0\d{9}$/.test(userProfile.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng số 0.';
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log(userProfile.avatar);
                await axios.put('http://localhost:8080/api/users/update-profile', userProfile, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });

                toast.success('Cập nhật thông tin thành công!', {
                    position: 'top-right',
                });

                setTimeout(() => {
                    navigate('/user/view-profile'); // Chuyển hướng về trang hồ sơ sau khi toast hiện xong
                }, 2000);
            } catch (err) {
                toast.error('Có lỗi xảy ra khi cập nhật thông tin!', {
                    position: 'top-right',
                });
                console.error('Error updating user profile:', err);
            }
        }
    };

    const handleCancel = () => {
        navigate('/user/view-profile'); // Quay lại trang hồ sơ
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];  // Lấy file ảnh được chọn
        setSelectedFile(file);  // Lưu vào state tạm thời

        if (file) {
            try {
                const avatarUrl = await uploadImageToFirebase(file);  // Upload ảnh và lấy URL
                setUserProfile(prevState => ({
                    ...prevState,
                    avatar: avatarUrl  // Cập nhật URL ảnh vào profile
                }));
                toast.success('Upload ảnh thành công!', { position: 'top-right' });
            } catch (err) {
                toast.error('Có lỗi xảy ra khi upload ảnh!', { position: 'top-right' });
                console.error('Error uploading avatar:', err);
            }
        }
    };

    return (
        <div className="container mt-5 custom-margin ">
            <br/>
            <br/>
            <h2>Cập nhật thông tin cá nhân</h2>
            <ToastContainer/>
            {error.fullName && <p className="text-danger">{error.fullName}</p>}
            {error.phoneNumber && <p className="text-danger">{error.phoneNumber}</p>}
            <form onSubmit={handleSubmit} className="form-control">
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Họ và tên</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={userProfile.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="avatar" className="form-label">Link ảnh đại diện</label>
                    <input
                        type="file"
                        className="form-control"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg"
                        onChange={handleUpload}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={userProfile.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Địa chỉ</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={userProfile.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                <button type="button" className="btn btn-danger ms-2" onClick={handleCancel}>Huỷ</button>
            </form>
        </div>
    );
};

export default UpdateUserProfile;
