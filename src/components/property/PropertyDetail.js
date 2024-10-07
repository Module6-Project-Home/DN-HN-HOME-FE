// src/components/PropertyDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/properties/${id}`);
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

    return (
        <div>
            <h1>{property.name}</h1>
            <p>{property.address}</p>
            <p>Price per night: ${property.pricePerNight}</p>
            <p>Description: {property.description}</p>
            {property.imageUrls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`${property.name} image ${index + 1}`}
                    style={{ width: "200px", margin: "5px" }} // Bạn có thể thêm margin nếu cần
                />
            ))}
            <p>Owner: {property.owner}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
        </div>
    );
};

export default PropertyDetail;
