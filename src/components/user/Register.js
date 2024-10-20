import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { API_URL } from '../constants/constants';

const RegisterForm = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const validateForm = () => {
        let errors = {};
        if (!/^[a-zA-Z0-9]+$/.test(formValues.username)) {
            errors.username = 'Tên người dùng chỉ được chứa chữ cái và số, không có ký tự đặc biệt.';
        }
        if (formValues.password.length < 6 || formValues.password.length > 32) {
            errors.password = 'Mật khẩu phải từ 6-32 kí tự.';
        }
        if (formValues.password !== formValues.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            errors.email = 'Email không hợp lệ.';
        }
        if (!/^0\d{9}$/.test(formValues.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng số 0.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            })
                .then(response => response.ok ? response.text() : response.text().then(text => { throw new Error(text); }))
                .then(data => {
                    toast.success("Đăng ký thành công!");
                    setTimeout(() => navigate('/login'), 2000);
                })
                .catch(error => toast.error(`Đăng ký thất bại: ${error.message}`));
        }
    };

    return (
        <MDBContainer fluid className="my-5">
            <MDBRow className="g-0 align-items-center">
                <MDBCol col="6" style={{ backgroundImage: 'url(https://luxurydanang.muongthanh.com/images/login-banner.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}></MDBCol>
                <MDBCol col="6">
                    <MDBCard className="cascading-left" style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)', marginTop: '-50px' }}>
                        <MDBCardBody className="p-5 shadow-5 text-center">
                            <h1 className="text-center mb-4">Đăng ký</h1>
                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div className="text-left mb-2">
                                    <label htmlFor='username'>Tên đăng nhập</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='username'
                                        type='text'
                                        value={formValues.username}
                                        name="username"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.username && <small className="text-danger">{formErrors.username}</small>}
                                </div>

                                {/* Password */}
                                <div className="text-left mb-2">
                                    <label htmlFor='password'>Mật khẩu</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='password'
                                        type='password'
                                        value={formValues.password}
                                        name="password"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                                </div>

                                {/* Confirm Password */}
                                <div className="text-left mb-2">
                                    <label htmlFor='confirmPassword'>Xác nhận mật khẩu</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='confirmPassword'
                                        type='password'
                                        value={formValues.confirmPassword}
                                        name="confirmPassword"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.confirmPassword && <small className="text-danger">{formErrors.confirmPassword}</small>}
                                </div>

                                {/* Full Name */}
                                <div className="text-left mb-2">
                                    <label htmlFor='fullName'>Họ và tên</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='fullName'
                                        type='text'
                                        value={formValues.fullName}
                                        name="fullName"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.fullName && <small className="text-danger">{formErrors.fullName}</small>}
                                </div>

                                {/* Email */}
                                <div className="text-left mb-2">
                                    <label htmlFor='email'>Email</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='email'
                                        type='email'
                                        value={formValues.email}
                                        name="email"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                                </div>

                                {/* Phone Number */}
                                <div className="text-left mb-2">
                                    <label htmlFor='phoneNumber'>Số điện thoại</label>
                                    <MDBInput
                                        wrapperClass='mb-2'
                                        id='phoneNumber'
                                        type='text'
                                        value={formValues.phoneNumber}
                                        name="phoneNumber"
                                        onChange={handleInputChange}
                                        labelClass="small-label"
                                    />
                                    {formErrors.phoneNumber && <small className="text-danger">{formErrors.phoneNumber}</small>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
                            </form>
                            <div className="mt-3">
                                <span>Bạn đã có tài khoản? </span>
                                <MDBBtn onClick={() => navigate('/login')} color="link" className="text-decoration-none">Đăng nhập</MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <ToastContainer />
        </MDBContainer>
    );
};

export default RegisterForm;
