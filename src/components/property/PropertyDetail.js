import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HeroBanner from "./HeroBanner"; // Sử dụng useNavigate

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/properties/detail/${id}`);
                setProperty(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching property:', error);
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    // Hàm xử lý khi người dùng bấm "Thuê ngay"
    const handleRentNow = () => {
        navigate(`/booking/${id}`); // Điều hướng đến trang booking với propertyId
    };

    return (
        <div>
            <HeroBanner></HeroBanner>
            <h1>{property.name}</h1>
            <p>{property.address}</p>
            <p>Price per night: {property.pricePerNight} VND</p>
            <p>Description: {property.description}</p>
            {property.images.map((url, index) => (
                <img
                    key={index}
                    src={url.imageUrl}
                    alt={`${property.name} image ${index + 1}`}
                    style={{ width: "200px", margin: "5px" }}
                />
            ))}
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>

            {/* Nút Thuê ngay */}
            <button onClick={handleRentNow}>Thuê ngay</button>
        </div>
    );
};

export default PropertyDetail;
