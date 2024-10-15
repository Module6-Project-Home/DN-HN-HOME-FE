import React from 'react';
import { Carousel } from 'react-bootstrap';
import './HeroBanner.css';

const HeroBanner = () => {
    return (
        <div className="container-fluid py-5 mb-5 hero-header">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-md-12 col-lg-7">
                        <h4 className="mb-3 text-secondary">NKQ Homestay</h4>
                        <h1 className="mb-5 display-3 text-primary">Nơi chốn yên bình, dành riêng cho bạn</h1>
                        <div className="position-relative mx-auto">
                            <form action="/property" method="get" className="d-flex">
                                <input
                                    type="search"
                                    name="address"
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                    placeholder="Nhập địa chỉ"
                                    aria-describedby="search-icon-1"
                                />
                                <button
                                    type="submit"
                                    id="search-icon-1"
                                    className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                                    style={{ top: 0, right: '25%' }}
                                >
                                    Tìm kiếm
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-5">
                        <Carousel className="rounded">
                            <Carousel.Item className="rounded">
                                <img
                                    className="img-fluid w-100 h-100 bg-secondary rounded"
                                    src="https://i.pinimg.com/736x/58/e1/d8/58e1d80e88167cc44d2d92efa2decbd0.jpg"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item className="rounded">
                                <img
                                    className="img-fluid w-100 h-100 rounded"
                                    src="https://i.pinimg.com/736x/58/e1/d8/58e1d80e88167cc44d2d92efa2decbd0.jpg"
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item className="rounded">
                                <img
                                    className="img-fluid w-100 h-100 rounded"
                                    src="https://i.pinimg.com/736x/58/e1/d8/58e1d80e88167cc44d2d92efa2decbd0.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
