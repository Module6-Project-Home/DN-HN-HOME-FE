import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {API_URL} from "../constants/constants";

const RegisterForm = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const validateForm = () => {
        let errors = {};

        // Kiểm tra username (chỉ chứa chữ cái và số)
        if (!/^[a-zA-Z0-9]+$/.test(formValues.username)) {
            errors.username = 'Tên người dùng chỉ được chứa chữ cái và số, không có ký tự đặc biệt.';
        }

        // Kiểm tra password (6-32 kí tự)
        if (formValues.password.length < 6 || formValues.password.length > 32) {
            errors.password = 'Mật khẩu phải từ 6-32 kí tự.';
        }

        // Kiểm tra confirm password (phải giống password)
        if (formValues.password !== formValues.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }

        // Kiểm tra email (validate email)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            errors.email = 'Email không hợp lệ.';
        }

        // Kiểm tra phone number (10 số và bắt đầu bằng số 0)
        if (!/^0\d{9}$/.test(formValues.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng số 0.';
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Thực hiện logic khi form hợp lệ (ví dụ: gửi dữ liệu lên server)
            fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues) // Dữ liệu gửi đi
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return response.text().then((text) => {
                            throw new Error(text);
                        });
                    }
                })
                .then(data => {
                    toast.success("Đăng ký thành công!");
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch((error) => {
                    toast.error(`Đăng ký thất bại: ${error.message}`);
                });
        }
    };

    return (
        <div className="container-fluid container-md custom-margin">
            <div className="card mx-auto shadow" style={{width: '40rem'}}>
                <div className="card-body">
                    <ToastContainer/>
                    <h1 className="text-center mb-0">Đăng ký</h1>
                    <form className="mt-5 " onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Tên người dùng</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-control"
                                value={formValues.username}
                                onChange={handleInputChange}
                                placeholder="Nhập tên người dùng"
                            />
                            {formErrors.username && <small className="text-danger">{formErrors.username}</small>}
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formValues.password}
                                onChange={handleInputChange}
                                placeholder="Nhập mật khẩu"
                            />
                            {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Xác nhận mật khẩu"
                            />
                            {formErrors.confirmPassword &&
                                <small className="text-danger">{formErrors.confirmPassword}</small>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formValues.email}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                            />
                            {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                className="form-control"
                                value={formValues.phoneNumber}
                                placeholder="Nhập số điện thoại"
                                onChange={handleInputChange}
                            />
                            {formErrors.phoneNumber && <small className="text-danger">{formErrors.phoneNumber}</small>}
                        </div>

                        <button type="submit" className="btn btn-primary">Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
