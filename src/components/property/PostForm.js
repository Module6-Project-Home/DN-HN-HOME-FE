import React, {useEffect, useState} from "react";
import axios from "axios";
import HeroBanner from "./HeroBanner";
import { useAuth } from '../auth/AuthContext';
import {useNavigate} from "react-router-dom";
import {uploadImageToFirebase} from "../firebaseUpload"; // Import context để lấy token

const AddProperty = () => {
    const { user } = useAuth(); // Lấy user và token từ context

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
        imageUrls: [] // Chứa URL ảnh đã upload lên Firebase
    });
    const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng


    const [selectedFiles, setSelectedFiles] = useState([]); // Lưu trữ nhiều file ảnh
    const [isUploading, setIsUploading] = useState(false);  // Quản lý trạng thái upload
    const [error, setError] = useState(""); // Quản lý lỗi

    const [errors, setErrors] = useState({});



    const [propertyTypes, setPropertyTypes] = useState([]); // Lưu danh sách property types từ API
    const [roomTypes, setRoomTypes] = useState([]); // Lưu danh sách property types từ API

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/property-types");
                const types = response.data;
                setPropertyTypes(types); // Lưu danh sách vào state

                // Đặt giá trị đầu tiên làm mặc định nếu danh sách không rỗng
                if (types.length > 0) {
                    setPropertyData((prevData) => ({
                        ...prevData,
                        propertyType: types[0].name // Đặt ID của loại tài sản đầu tiên
                    }));
                }
            } catch (error) {
                console.error("Error fetching property types:", error);
                setError("Failed to load property types.");
            }
        };
        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/room-types");
                const types = response.data;
                setRoomTypes(types); // Lưu danh sách vào state

                // Đặt giá trị đầu tiên làm mặc định nếu danh sách không rỗng
                if (types.length > 0) {
                    setPropertyData((prevData) => ({
                        ...prevData,
                        roomType: types[0].name // Đặt ID của loại tài sản đầu tiên
                    }));
                }
            } catch (error) {
                console.error("Error fetching property types:", error);
                setError("Failed to load property types.");
            }
        };
        fetchRoomTypes();
        fetchPropertyTypes();
    }, []);

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
            setError("Failed to upload images.");
        } finally {
            setIsUploading(false);
        }
    };



    const validateData = () => {
        const newErrors = {};

        // Kiểm tra tên homestay
        if (!propertyData.name) {
            newErrors.name = "Tên homestay không được để trống.";
        }

        // Kiểm tra địa chỉ homestay
        if (!propertyData.address) {
            newErrors.address = "Địa chỉ homestay không được để trống.";
        }

        // Kiểm tra mô tả homestay
        if (!propertyData.description) {
            newErrors.description = "Mô tả homestay không được để trống.";
        }

        // Kiểm tra số phòng ngủ (tối thiểu 1, tối đa 10)
        if (propertyData.bedrooms < 1 || propertyData.bedrooms > 10) {
            newErrors.bedrooms = "Số phòng ngủ phải từ 1 đến 10.";
        }

        // Kiểm tra số phòng tắm (tối thiểu 1, tối đa 3)
        if (propertyData.bathrooms < 1 || propertyData.bathrooms > 3) {
            newErrors.bathrooms = "Số phòng tắm phải từ 1 đến 3.";
        }

        // Kiểm tra số lượng ảnh đã tải lên
        if (propertyData.imageUrls.length === 0) {
            newErrors.imageUrls = "Vui lòng upload ít nhất 1 ảnh.";
        }

        // Cập nhật trạng thái lỗi
        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };



    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        let jwtToken = localStorage.getItem("jwtToken");
        e.preventDefault();

        if (validateData()) {



            console.log("jwtToken: " + jwtToken)

            try {
                const response = await axios.post("http://localhost:8080/api/properties", propertyData, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`, // Gửi token ở đây
                        'Content-Type': 'application/json', // Thêm Content-Type nếu cần
                    },
                });
                alert("Property added successfully!");
                console.log(response.data);
                navigate('/home'); // Điều hướng về trang chủ ("/")

                setPropertyData({ // Reset form sau khi thêm thành công
                    name: "",
                    propertyType: "",
                    roomType: "",
                    address: "",
                    bedrooms: 0,
                    bathrooms: 0,
                    description: "",
                    pricePerNight: 0,
                    status: "Còn Trống",
                    imageUrls: []
                });
            } catch (error) {
                console.error("Error adding property:", error);
                setError("Failed to add property. Please check if you're logged in and have the right permissions.");
            }
        }
    };
    const roles = JSON.parse(localStorage.getItem("roles")) || [];
    console.log(roles[0])


    return (
        <div>
            {roles[0] ==='ROLE_HOST' ? (
        <div className="container mt-4">
            <HeroBanner />
            <h2 className="text-center mb-4">Thêm mới Property</h2>

            <form onSubmit={handleSubmit}>
                {/* Tên nhà */}
                <div className="col-md-6">
                    <label className="form-label">Tên homestay:</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                        name="name"
                        value={propertyData.name}
                        onChange={handleChange}

                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Loại tài sản */}
                <div className="form-group mb-3">
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

                {/* Loại phòng */}
                <div className="form-group mb-3">
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

                {/* Địa chỉ */}
                <div className="col-md-6">
                    <label className="form-label">Địa chỉ:</label>
                    <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                        name="address"
                        value={propertyData.address}
                        onChange={handleChange}

                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                {/* Số phòng ngủ */}
                <div className="col-md-6">
                    <label className="form-label">Số phòng ngủ:</label>
                    <input
                        type="number"
                        className={`form-control ${errors.bedrooms ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
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
                        className={`form-control ${errors.bathrooms ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                        name="bathrooms"
                        value={propertyData.bathrooms}
                        onChange={handleChange}

                    />
                    {errors.bathrooms && <div className="invalid-feedback">{errors.bathrooms}</div>}
                </div>

                {/* Mô tả */}
                <div className="form-group mb-3">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                        id="description"
                        name="description"
                        value={propertyData.description}
                        onChange={handleChange}

                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                {/* Giá mỗi đêm */}
                <div className="form-group mb-3">
                    <label htmlFor="pricePerNight">Giá mỗi đêm:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="pricePerNight"
                        name="pricePerNight"
                        value={propertyData.pricePerNight}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Trạng thái */}
                <div className="form-group mb-3">
                    <input
                        type="hidden"
                        className="form-control"
                        id="status"
                        name="status"
                        value={propertyData.status}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Upload file ảnh */}
                <div className="form-group mb-3">
                    <label htmlFor="imageUpload">Chọn ảnh để tải lên:</label>
                    <input
                        type="file"
                        className="form-control"
                        id="imageUpload"
                        accept="image/png, image/jpeg"
                        multiple
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={handleUploadImage}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload Images"}
                    </button>
                </div>

                {/* Hiển thị các ảnh đã thêm */}
                <div className="mb-3">
                    <label>Các ảnh đã thêm:</label>
                    <ul className="list-unstyled">
                        {propertyData.imageUrls.map((url, index) => (
                            <li key={index} className="mb-2">
                                <img src={url} alt={`Uploaded ${index}`} width="100" className="img-thumbnail" />
                            </li>
                        ))}
                    </ul>
                    {errors.imageUrls && <div className="text-danger">{errors.imageUrls}</div>} {/* Hiển thị lỗi nếu có */}

                </div>

                {/* Nút submit */}
                <button type="submit" className="btn btn-success">Thêm mới Property</button>
            </form>
        </div>) : (        <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">

                <h1 className="text-center">Bạn không có quyền truy cập vào trang này!</h1>

                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default AddProperty;
