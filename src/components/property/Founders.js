import React from 'react';
import './Founders.css'; // Thêm file CSS cho styles
import './HeroBanner.css'

const Founders = () => {
    const founders = [
        {
            name: 'Tô Thanh Ngọc',
            role: 'Co-Founder',
            birthYear: 1997,
            location: 'CodeGym Hà Nội',
            color: '#007BFF',
            image: 'https://ca.slack-edge.com/T062S4QFUJZ-U06LKCWNNQN-40dd477500fc-512', // Thay thế bằng đường dẫn ảnh thực tế
        },
        {
            name: 'Hán Bảo Ngọc',
            role: 'Co-Founder',
            birthYear: 1997,
            location: 'CodeGym Hà Nội',
            color: '#28A745',
            image: 'https://ca.slack-edge.com/T062S4QFUJZ-U06RRF18DH9-40833e6b3714-512', // Thay thế bằng đường dẫn ảnh thực tế
        },
        {
            name: 'Nguyễn Đức Kiên',
            role: 'Developer',
            birthYear: 1999,
            location: 'CodeGym Hà Nội',
            color: '#DC3545',
            image: 'https://ca.slack-edge.com/T062S4QFUJZ-U070S098XD1-40f8dab535cc-512', // Thay thế bằng đường dẫn ảnh thực tế
        },
        {
            name: 'Nguyễn Đức Thảo Nguyên',
            role: 'Designer',
            birthYear: 1997,
            location: 'CodeGym Đà Nẵng',
            color: '#6F42C1',
            image: 'https://ca.slack-edge.com/T062S4QFUJZ-U070UHH75CL-3297140ad074-512', // Thay thế bằng đường dẫn ảnh thực tế
        },
        {
            name: 'Đỗ Trung Quyết',
            role: 'Co-Founder',
            birthYear: 1994,
            location: 'CodeGym Đà Nẵng',
            color: '#FFC107',
            image: 'https://ca.slack-edge.com/T062S4QFUJZ-U070UHHA2GL-5221a017d487-512', // Thay thế bằng đường dẫn ảnh thực tế
        },
    ];

    return (
        <div className="container py-5 mb-5 hero-header">

        <div className="founders-container">
            <h2 className="founders-title">Nhà Sáng Lập</h2>
            <div className="founders-list">
                {founders.map((founder, index) => (
                    <div key={index} className="founder-card">
                        <div className="founder-image" style={{ borderColor: founder.color }}>
                            <img
                                src={founder.image} // Sử dụng đường dẫn ảnh thực tế
                                alt={founder.name}
                            />
                        </div>
                        <h3 className="founder-name">{founder.name}</h3>
                        <p className="founder-role">{founder.role}</p>
                        <p className="founder-location">{founder.location}</p>
                        <p className="founder-birth-year">Sinh năm: {founder.birthYear}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Founders;
