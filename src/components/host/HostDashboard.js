import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const HostDashboard = () => {

    const location = useLocation();
    const { login } = useAuth();

    // Function to get token from query string
    const getQueryParams = (urlSearchParams) => {
        const params = new URLSearchParams(urlSearchParams);
        return params.get('token'); // Get token value
    };

    const tokenFromParams = getQueryParams(location.search);
    console.log('tokenFromParams', tokenFromParams);

    useEffect(() => {
        const fetchUser = async () => {
            if (tokenFromParams) {
                const decoded = jwtDecode(tokenFromParams);
                const username = decoded.sub;
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/findByUsername?username=${username}`);
                    console.log(response.data, 'response');
                    const { roles, id } = response.data;
                    const rolesArr = roles.map(role => role.name);

                    // Gọi login để cập nhật context
                    login(username, rolesArr, id, tokenFromParams);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="container">
            <h1>Chào mừng, Chủ Nhà!</h1>
            <p>Đây là trang dashboard dành cho chủ nhà.</p>
            {/* Thêm nội dung quản lý tài sản ở đây */}
        </div>
    );
};

export default HostDashboard;
