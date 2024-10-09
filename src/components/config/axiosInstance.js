// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api", // Cấu hình base URL
});

// Thêm interceptor để thêm Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
