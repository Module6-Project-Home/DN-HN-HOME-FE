import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Tùy chọn để cuộn mượt mà
        });
    };

    return (
        <div className="bg-dark text-white-50 footer pt-4 mt-5">
            <div className="container-fluid">
                <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
                    <div className="row g-4 justify-content-between">
                        <div className="col-lg-3">
                            <a className="text-decoration-none" href="#" onClick={scrollToTop}>
                                <h1 className="text-primary mb-0">Nhà Tốt</h1>
                                <p className="text-secondary mb-0">Ngôi nhà xinh đẹp</p>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <div className="d-flex justify-content-end pt-3">
                                <Link className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" to="#"><i className="fab fa-twitter"></i></Link>
                                <Link className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" to="#"><i className="fab fa-facebook-f"></i></Link>
                                <Link className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" to="#"><i className="fab fa-youtube"></i></Link>
                                <Link className="btn btn-outline-secondary btn-md-square rounded-circle" to="#"><i className="fab fa-linkedin-in"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Tại sao lại lựa chọn Nhà Tốt!</h4>
                            <p className="mb-4">Chúng tôi mang đến cho bạn cảm giác như đang ở chính ngôi nhà của mình, với không gian ấm cúng và thoải mái.
                                Hãy để chúng tôi làm cho hành trình của bạn trở nên đáng nhớ.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Thông tin Nhà Tốt</h4>
                            <Link className="btn-link text-decoration-none" to="/home/about" onClick={scrollToTop}>Về chúng tôi</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Liên hệ với chúng tôi</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Chính sách bảo mật</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Điều khoản & Điều kiện</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Chính sách</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Hỗ trợ</Link>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Tài khoản</h4>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Tài khoản của chúng tôi</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Chi tiết nhà</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Đặt phòng</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Danh sách yêu thích</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Lịch sử đặt nhà</Link>
                            <Link className="btn-link text-decoration-none" to="" onClick={scrollToTop}>Thông tin đặt nhà</Link>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Liên hệ</h4>
                            <p>Địa chỉ: Codegym Đà Nẵng, Hà Nội</p>
                            <p>Email: NhaTot2024@gmail.com</p>
                            <p>Phone: +0123 4567 8910</p>
                            <p>Thông tin thanh toán</p>
                            <img src="https://dauthau.asia/uploads/page/vietqr-thanh-toan-dauthau.info.png" className="img-fluid" alt="Thông tin thanh toán"
                                 style={{ maxWidth: '50px', height: 'auto' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
