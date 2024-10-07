import React from 'react';

const Footer = () => {
    return (
        <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
            <div className="container py-5">
                <div className="pb-4 mb-4" style={{borderBottom: '1px solid rgba(226, 175, 24, 0.5)'}}>
                    <div className="row g-4 justify-content-between">
                        <div className="col-lg-3">
                            <a href="#">
                                <h1 className="text-primary mb-0">QNK Homestay</h1>
                                <p className="text-secondary mb-0">Ngôi nhà xinh đẹp</p>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <div className="d-flex justify-content-end pt-3">
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-youtube"></i></a>
                                <a className="btn btn-outline-secondary btn-md-square rounded-circle" href=""><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Tại sao lại lựa chọn QNK Homestay!</h4>
                            <p className="mb-4">Chúng tôi mang đến cho bạn cảm giác như đang ở chính ngôi nhà của mình, với không gian ấm cúng và thoải mái.
                                Hãy để chúng tôi làm cho hành trình của bạn trở nên đáng nhớ.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Thông tin QNK Homestay</h4>
                            <a className="btn-link" href="">Về chúng tôi</a>
                            <a className="btn-link" href="">Liên hệ với chúng tôi</a>
                            <a className="btn-link" href="">Chính sách bảo mật</a>
                            <a className="btn-link" href="">Điều khoản & Điều kiện</a>
                            <a className="btn-link" href="">Chính sách</a>
                            <a className="btn-link" href="">Hỗ trợ</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Tài khoản</h4>
                            <a className="btn-link" href="">Tài khoản của chúng tôi</a>
                            <a className="btn-link" href="">Chi tiết nhà</a>
                            <a className="btn-link" href="">Đặt phòng</a>
                            <a className="btn-link" href="">Danh sách yêu thích</a>
                            <a className="btn-link" href="">Lịch sử đặt nhà</a>
                            <a className="btn-link" href="">Thông tin đặt nhà</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Liên hệ</h4>
                            <p>Địa chỉ: Codegym Đà Nẵng, Hà Nội</p>
                            <p>Email: 3Nqkhomestay@gmail.com</p>
                            <p>Phone: +0123 4567 8910</p>
                            <p>Thông tin thanh toán</p>
                            <img src="/static/customer/img/payment.png" className="img-fluid" alt="Thông tin thanh toán" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
