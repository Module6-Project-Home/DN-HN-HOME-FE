import React, {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from '../auth/AuthContext';
import {useNavigate} from "react-router-dom";
import {uploadImageToFirebase} from "../firebaseUpload";
import HeaderAdmin from "./layout/HeaderAdmin";
import SidebarAdmin from "./layout/SidebarAdmin";
import {toast, ToastContainer} from "react-toastify"; // Import context để lấy token

const AddNewProperty = () => {
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
        status: "VACANT",
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
                console.error("Lỗi khi tải dữ liệu loại tài sản", error);
                setError("Lỗi khi tải dữ liệu loại tài sản.");
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
                console.error("Lỗi khi tải dữ liệu loại phòng:", error);
                setError("Lỗi khi tải dữ liệu loại phòng.");
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

        // Kiểm tra giá thuê (tối thiểu 100.000, tối đa 10.000.000)
        if (propertyData.pricePerNight < 10000 || propertyData.pricePerNight > 10000000) {
            newErrors.pricePerNight = "Giá thuê 1 đêm phải từ 100.000VNĐ đến 10.000.000VNĐ ";
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
                toast.success("Cập nhật thành công!");
                setTimeout(() => {
                    navigate('/host/dashboard');
                }, 2000);

                // setPropertyData({ // Reset form sau khi thêm thành công
                //     name: "",
                //     propertyType: "",
                //     roomType: "",
                //     address: "",
                //     bedrooms: 0,
                //     bathrooms: 0,
                //     description: "",
                //     pricePerNight: 0,
                //     status: "VACANT",
                //     imageUrls: []
                // });
            } catch (error) {
                console.error("Tạo mới thất bại:", error);
                setError("Không thể tạo mới tài sản. Vui lòng kiểm tra xem bạn đã đăng nhập và có quyền phù hợp hay chưa.");
            }
        }
    };
    const handleDeleteImage = (index) => {
        const updatedImageUrls = propertyData.imageUrls.filter((_, i) => i !== index);
        setPropertyData({
            ...propertyData,
            imageUrls: updatedImageUrls
        });
    };


    return (
        <div>
            <div className="sb-nav-fixed">
                <HeaderAdmin />
                <div id="layoutSidenav">
                    <SidebarAdmin />
                    <ToastContainer />

                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                                <div className="w-100"> {/* Đảm bảo nội dung không bị thu hẹp */}
                    <h2 className="text-center mb-4">Thêm mới tài sản</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Tên nhà */}
                        <div className="col-md-6 ">
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
                        <div className="form-group mb-6 col-md-6">
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
                        <div className="form-group mb-6 col-md-6">
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
                        <div className="form-group mb-6 col-md-6">
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
                        <div className="form-group mb-6 col-md-6">
                            <label htmlFor="pricePerNight">Giá mỗi đêm:</label>
                            <input
                                type="number"
                                className={`form-control  ${errors.pricePerNight ? 'is-invalid' : ''}`} // Hiển thị lỗi nếu có
                                id="pricePerNight"
                                name="pricePerNight"
                                value={propertyData.pricePerNight}
                                onChange={handleChange}
                            />
                            {errors.pricePerNight && <div className="invalid-feedback">{errors.pricePerNight}</div>}

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
                                <button type="submit" className="btn btn-success">Thêm mới tài sản</button>
                            </div>)}
                    </form>
                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewProperty;
