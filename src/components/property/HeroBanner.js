import React from 'react';
import {Carousel} from 'react-bootstrap';
import './HeroBanner.css';

const HeroBanner = () => {
    return (
        <div className="container py-5 mb-5 hero-header">
                <div className="row g-5 align-items-center">
                    <div className="col-md-12 col-lg-7">
                        <h1 className="mb-5 display-3 text-primary">Nơi chốn yên bình, dành riêng cho bạn</h1>

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
                                    src="https://i.pinimg.com/736x/68/af/0c/68af0c5239dfc3660758b525befd8f12.jpg"
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item className="rounded">
                                <img
                                    className="img-fluid w-100 h-100 rounded"
                                    src="https://i.pinimg.com/564x/a8/62/ca/a862ca8ed663108231b5776129d92c62.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
        </div>
    );
};

export default HeroBanner;
