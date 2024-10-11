// SuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div className="container text-center mt-5 pt-5"> {/* Sử dụng lớp Bootstrap để đẩy nội dung xuống */}
            <h1>Yêu cầu nâng cấp thành công!</h1>
            <p>Chúng tôi đã nhận được yêu cầu của bạn và sẽ xem xét trong thời gian sớm nhất.</p>
            <Link to="/home" className="btn btn-primary">Quay lại Trang Chủ</Link>
        </div>
    );
};

export default SuccessPage;

