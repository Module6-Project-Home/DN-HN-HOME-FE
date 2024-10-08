import React, { useState } from 'react';

const RegisterForm = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: ''
    });

    // Khai báo serverResponse để lưu thông báo từ server
    const [serverResponse, setServerResponse] = useState('');

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
            //console.log('Form data: ', formValues);
            // Thực hiện logic khi form hợp lệ (ví dụ: gửi dữ liệu lên server)
            fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues) // Dữ liệu gửi đi
            })
                .then(response => response.json())
                .then(data => {
                    // Xử lý phản hồi từ backend
                    setServerResponse(data.message);
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div className="container-fluid container-md custom-margin">
            <div className="mt-5">
                <form className="mt-5 " onSubmit={handleSubmit}>
                    <div className="form-group col-md-3">
                        <label>Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formValues.username}
                            onChange={handleInputChange}
                        />
                        {formErrors.username && <small className="text-danger">{formErrors.username}</small>}
                    </div>

                    <div className="form-group col-md-3">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                        {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                    </div>

                    <div className="form-group col-md-3">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {formErrors.confirmPassword &&
                            <small className="text-danger">{formErrors.confirmPassword}</small>}
                    </div>

                    <div className="form-group col-md-3">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                        {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                    </div>

                    <div className="form-group col-md-3">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="form-control"
                            value={formValues.phoneNumber}
                            onChange={handleInputChange}
                        />
                        {formErrors.phoneNumber && <small className="text-danger">{formErrors.phoneNumber}</small>}
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">Đăng ký</button>
                </form>
                {/* Hiển thị phản hồi từ server */}
                {serverResponse && <p>{serverResponse}</p>}
            </div>
        </div>
    );
};

export default RegisterForm;
