import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostForm = () => {
    const [name, setName] = useState('');
    const [propertyType, setPropertyType] = useState(''); // Giá trị mặc định
    const [roomType, setRoomType] = useState(''); // Chọn loại phòng mặc định
    const [address, setAddress] = useState('');
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [description, setDescription] = useState('');
    const [pricePerNight, setPricePerNight] = useState('');
    const [owner, setOwner] = useState('');
    const [status, setStatus] = useState('Còn Trống'); // Trạng thái mặc định
    const [imageUrls, setImageUrls] = useState(['']); // Danh sách ảnh
    const [propertyTypes, setPropertyTypes] = useState([]); // Danh sách loại tài sản từ API
    const [roomTypes, setRoomTypes] = useState([]); // Danh sách loại tài sản từ API


    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/property-types');
                setPropertyTypes(response.data); // Giả sử API trả về danh sách loại tài sản
                if (response.data.length > 0) {
                    setPropertyType(response.data[0].name); // Chọn loại tài sản đầu tiên làm mặc định
                }
                const response2 = await axios.get('http://localhost:8080/api/room-types');
                setRoomTypes(response2.data); // Giả sử API trả về danh sách loại tài sản
                if (response2.data.length > 0) {
                    setRoomType(response2.data[0].name); // Sửa thành setRoomType
                }
            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };

        fetchPropertyTypes();
    }, []); // Chỉ chạy 1 lần khi component mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProperty = {
            name,
            propertyType, // Gửi tên loại tài sản
            roomType,
            address,
            bedrooms,
            bathrooms,
            description,
            pricePerNight: parseFloat(pricePerNight),
            owner,
            status,
            imageUrls,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/properties', newProperty);
            console.log('Property posted successfully:', response.data);

            // Reset form after successful post
            setName('');
            setPropertyType('');
            setRoomType('');
            setAddress('');
            setBedrooms(1);
            setBathrooms(1);
            setDescription('');
            setPricePerNight('');
            setOwner('');
            setStatus('Còn Trống');
            setImageUrls(['']);
        } catch (error) {
            console.error('Error posting property:', error.response?.data || error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Property Type:</label>
                <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                >
                    {propertyTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name} {/* Render tên loại tài sản */}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Room Type:</label>
                <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                >
                    {roomTypes.map((type1) => (
                        <option key={type1.id} value={type1.name}>
                            {type1.name} {/* Render tên loại tài sản */}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Bedrooms:</label>
                <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    min="1"
                    required
                />
            </div>
            <div>
                <label>Bathrooms:</label>
                <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    min="1"
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Price Per Night:</label>
                <input
                    type="number"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Owner:</label>
                <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Status:</label>
                <input
                    type="hidden"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </div>
            <div>
                <label>Image URLs:</label>
                <input
                    type="file"
                    value={imageUrls.join(',')}
                    onChange={(e) => setImageUrls(e.target.value.split(','))}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default PostForm;
