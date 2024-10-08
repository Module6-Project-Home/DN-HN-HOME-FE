import React, { useState } from "react";
import axios from "axios";
import HeroBanner from "./HeroBanner";
import { uploadImageToFirebase } from "../uploadImageToFirebase";

const AddProperty = () => {
    const [propertyData, setPropertyData] = useState({
        name: "",
        propertyType: "",
        roomType: "",
        address: "",
        bedrooms: 0,
        bathrooms: 0,
        description: "",
        pricePerNight: 0,
        status: "Còn Trống",
        owner: "Nguyen", // Giả sử người dùng cung cấp tên owner
        imageUrls: [] // Chứa URL ảnh đã upload lên Firebase
    });

    const [selectedFiles, setSelectedFiles] = useState([]); // Lưu trữ nhiều file ảnh
    const [isUploading, setIsUploading] = useState(false);  // Quản lý trạng thái upload

    // Xử lý khi thay đổi dữ liệu trong form
    const handleChange = (e) => {
        setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
    };

    // Xử lý khi chọn nhiều file ảnh
    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]); // Lưu trữ tất cả các file đã chọn
    };

    // Upload nhiều ảnh lên Firebase và lưu URL vào state
    const handleUploadImage = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select images to upload!");
            return;
        }

        setIsUploading(true);
        const imageUrls = []; // Lưu URL của các ảnh

        try {
            // Upload từng file lên Firebase
            for (const file of selectedFiles) {
                const url = await uploadImageToFirebase(file);
                imageUrls.push(url); // Thêm URL vào mảng
            }

            // Lưu URL của tất cả các ảnh vào propertyData
            setPropertyData((prevData) => ({
                ...prevData,
                imageUrls: [...prevData.imageUrls, ...imageUrls] // Gộp URL mới vào state
            }));

            setSelectedFiles([]); // Clear file input sau khi upload
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Failed to upload images.");
        } finally {
            setIsUploading(false);
        }
    };

    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (propertyData.imageUrls.length === 0) {
            alert("Please upload at least one image!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/properties", propertyData);
            alert("Property added successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error adding property:", error);
            alert("Failed to add property.");
        }
    };

    return (
        <div>
            <HeroBanner></HeroBanner>
            <h2>Thêm mới Property</h2>
            <form onSubmit={handleSubmit}>
                {/* Tên nhà */}
                <div>
                    <label>Tên nhà:</label>
                    <input
                        type="text"
                        name="name"
                        value={propertyData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Loại tài sản */}
                <div>
                    <label>Loại tài sản:</label>
                    <input
                        type="text"
                        name="propertyType"
                        value={propertyData.propertyType}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Loại phòng */}
                <div>
                    <label>Loại phòng:</label>
                    <input
                        type="text"
                        name="roomType"
                        value={propertyData.roomType}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Địa chỉ */}
                <div>
                    <label>Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        value={propertyData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Số phòng ngủ */}
                <div>
                    <label>Số phòng ngủ:</label>
                    <input
                        type="number"
                        name="bedrooms"
                        value={propertyData.bedrooms}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Số phòng tắm */}
                <div>
                    <label>Số phòng tắm:</label>
                    <input
                        type="number"
                        name="bathrooms"
                        value={propertyData.bathrooms}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label>Mô tả:</label>
                    <textarea
                        name="description"
                        value={propertyData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                {/* Giá mỗi đêm */}
                <div>
                    <label>Giá mỗi đêm:</label>
                    <input
                        type="number"
                        name="pricePerNight"
                        value={propertyData.pricePerNight}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Trạng thái */}
                <div>
                    <label>Trạng thái:</label>
                    <input
                        type="text"
                        name="status"
                        value={propertyData.status}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Chủ nhà */}
                <div>
                    <label>Chủ nhà:</label>
                    <input
                        type="text"
                        name="owner"
                        value={propertyData.owner}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Upload file ảnh */}
                <div>
                    <label>Chọn ảnh để tải lên:</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        multiple
                        onChange={handleFileChange}
                    />
                    <button type="button" onClick={handleUploadImage} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Images"}
                    </button>
                </div>

                {/* Hiển thị các ảnh đã thêm */}
                <div>
                    <label>Các ảnh đã thêm:</label>
                    <ul>
                        {propertyData.imageUrls.map((url, index) => (
                            <li key={index}>
                                <img src={url} alt={`Uploaded ${index}`} width="100" />
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Nút submit */}
                <button type="submit" >Thêm mới Property</button>
            </form>
        </div>
    );
};

export default AddProperty;
