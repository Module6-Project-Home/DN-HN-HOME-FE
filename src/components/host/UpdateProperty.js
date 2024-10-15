import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';
import { uploadImageToFirebase } from "../firebaseUpload";
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import {toast, ToastContainer} from "react-toastify";

const UpdateProperty = () => {
    const { id } = useParams(); // Lấy ID của property từ URL
    const { user } = useAuth(); // Lấy user từ AuthContext
    const navigate = useNavigate();

    const [propertyData, setPropertyData] = useState({
        name: "",
        propertyType: "",
        roomType: "",
        address: "",
        bedrooms: 0,
        bathrooms: 0,
        description: "",
        pricePerNight: 0,
        status: "",
        imageUrls: [] // URL các ảnh đã upload lên Firebase
    });

    const [selectedFiles, setSelectedFiles] = useState([]); // Quản lý các file ảnh được chọn
    const [isUploading, setIsUploading] = useState(false); // Quản lý trạng thái upload
    const [error, setError] = useState(""); // Quản lý lỗi
    const [errors, setErrors] = useState({});
    const [propertyTypes, setPropertyTypes] = useState([]); // Lưu danh sách property types từ API
    const [roomTypes, setRoomTypes] = useState([]); // Lưu danh sách room types từ API

    // Lấy thông tin property để cập nhật
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/properties/${id}`);
                setPropertyData(response.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu tài sản:", error);
                setError("Lỗi khi tải dữ liệu tài sản");
            }
        };

        // Lấy danh sách loại tài sản và loại phòng
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/property-types");
                setPropertyTypes(response.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu loại tài sản:", error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/room-types");
                setRoomTypes(response.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu loại phòng:", error);
            }
        };

        fetchProperty();
        fetchPropertyTypes();
        fetchRoomTypes();
    }, [id]);

    // Xử lý thay đổi input form
    const handleChange = (e) => {
        setPropertyData({...propertyData, [e.target.name]: e.target.value});
    };

    // Xử lý khi chọn nhiều file ảnh
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files); // Lưu trữ các file được chọn

        // Gọi hàm upload ngay sau khi có file mới
        await handleUploadImage(files);
    };

    // Upload ảnh lên Firebase
    const handleUploadImage = async (files) => {
        // if (files.length === 0) {
        //     alert("Please select images to upload!");
        //     return;
        // }

        setIsUploading(true);
        const imageUrls = []; // URL các ảnh đã upload

        try {
            // Upload từng ảnh lên Firebase
            for (const file of files) {
                const url = await uploadImageToFirebase(file);
                imageUrls.push(url);
            }

            // Cập nhật imageUrls vào propertyData
            setPropertyData((prevData) => ({
                ...prevData,
                imageUrls: [...prevData.imageUrls, ...imageUrls]
            }));
        } catch (error) {
            console.error("Lỗi tải ảnh lên:", error);
            setError("Lỗi tải ảnh lên.");
        } finally {
            setIsUploading(false);
            setSelectedFiles([]); // Clear input file
        }
    };

    // Hàm xóa ảnh
    const handleDeleteImage = (index) => {
        const updatedImageUrls = propertyData.imageUrls.filter((_, i) => i !== index);
        setPropertyData({
            ...propertyData,
            imageUrls: updatedImageUrls
        });
    };

    // Xử lý validate dữ liệu
    const validateData = () => {
        const newErrors = {};

        if (!propertyData.name) {
            newErrors.name = "Tên homestay không được để trống.";
        }

        if (!propertyData.address) {
            newErrors.address = "Địa chỉ homestay không được để trống.";
        }

        if (!propertyData.description) {
            newErrors.description = "Mô tả homestay không được để trống.";
        }

        if (propertyData.bedrooms < 1 || propertyData.bedrooms > 10) {
            newErrors.bedrooms = "Số phòng ngủ phải từ 1 đến 10.";
        }

        if (propertyData.bathrooms < 1 || propertyData.bathrooms > 3) {
            newErrors.bathrooms = "Số phòng tắm phải từ 1 đến 3.";
        }

        // Kiểm tra giá thuê (tối thiểu 100.000, tối đa 10.000.000)
        if (propertyData.pricePerNight < 10000 || propertyData.pricePerNight > 10000000) {
            newErrors.pricePerNight = "Giá thuê 1 đêm phải từ 100.000VNĐ đến 10.000.000VNĐ ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        let jwtToken = localStorage.getItem("jwtToken");
        e.preventDefault();

        if (validateData()) {
            try {
                const response = await axios.put(`http://localhost:8080/api/properties/${id}`, propertyData, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success("Cập nhật thành công!");
                setTimeout(() => {
                    navigate('/host/dashboard');
                }, 2000);
            } catch (error) {
                toast.error(`Cập nhật thất bại: ${error.message}`);
                setError("Không thể cập nhật tài sản. Vui lòng kiểm tra xem bạn đã đăng nhập và có quyền phù hợp hay chưa");
            }
        }
    };


    return (
        <div>

                <div className="sb-nav-fixed">
                    <HeaderAdmin/>
                    <div id="layoutSidenav">
                        <SidebarAdmin/>
                        <ToastContainer />

                        <div id="layoutSidenav_content">
                            <div className="container mt-4">

                                <h2 className="text-center mb-4">Cập nhật tài sản</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="col-md-6 ">
                                        <label className="form-label">Tên homestay:</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            value={propertyData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="form-group mb-3 col-md-6">
                                        <label htmlFor="propertyType">Loại tài sản:</label>
                                        <select
                                            className="form-select"
                                            id="propertyType"
                                            name="propertyType"
                                            value={propertyData.propertyType}
                                            onChange={handleChange}
                                            required
                                        >
                                            {propertyTypes.map((type) => (
                                                <option key={type.id} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-3 col-md-6">
                                        <label htmlFor="roomType">Loại phòng:</label>
                                        <select
                                            className="form-select"
                                            id="roomType"
                                            name="roomType"
                                            value={propertyData.roomType}
                                            onChange={handleChange}
                                            required
                                        >
                                            {roomTypes.map((type) => (
                                                <option key={type.id} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Địa chỉ:</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            name="address"
                                            value={propertyData.address}
                                            onChange={handleChange}
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Số phòng ngủ:</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.bedrooms ? 'is-invalid' : ''}`}
                                            name="bedrooms"
                                            value={propertyData.bedrooms}
                                            onChange={handleChange}
                                        />
                                        {errors.bedrooms && <div className="invalid-feedback">{errors.bedrooms}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Số phòng tắm:</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.bathrooms ? 'is-invalid' : ''}`}
                                            name="bathrooms"
                                            value={propertyData.bathrooms}
                                            onChange={handleChange}
                                        />
                                        {errors.bathrooms && <div className="invalid-feedback">{errors.bathrooms}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Mô tả:</label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            name="description"
                                            value={propertyData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Giá mỗi đêm:</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.pricePerNight ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                                            name="pricePerNight"
                                            value={propertyData.pricePerNight}
                                            onChange={handleChange}
                                        />
                                        {errors.pricePerNight && <div className="invalid-feedback">{errors.pricePerNight}</div>}
                                    </div>

                                    {/* Phần upload và hiển thị ảnh */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Chọn ảnh:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {propertyData.imageUrls.length > 0 && (
                                        <div>
                                            <label className="form-label">Các ảnh đã tải lên:</label>
                                            <div className="row">
                                                {propertyData.imageUrls.map((url, index) => (
                                                    <div key={index} className="col-md-3 position-relative">
                                                        <img
                                                            style={{ width: '100%', height: '300px' }}
                                                            src={url}
                                                            alt={`Property ${index}`}
                                                            className="img-fluid"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger position-absolute top-0 end-0 m-2"
                                                            onClick={() => handleDeleteImage(index)} // Gọi hàm xử lý xóa ảnh
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                    {isUploading ? (
                                        <p>Đang tải lên ảnh...</p>
                                    ) : (

                                    <div className="mt-3">
                                        <button type="submit" className="btn btn-success">Cập nhật tài sản</button>
                                    </div>)}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
    );
};

export default UpdateProperty;
