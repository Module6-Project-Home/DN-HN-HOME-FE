import {useEffect, useState} from "react";
import axios from "axios";

const PropertyCount = ({ownerId,token}) => {
    const [propertyCount,setPropertyCount] = useState(0);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchPropertyCount = async () => {
            try{
                const response = await axios.get(`http://localhost:8080/api/host/countHostProperties`,{
                    params: {ownerId},
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPropertyCount(response.data);
            } catch (err){
                setError("Không thể tải số lượng phòng.");
                console.error("Lỗi khi lấy số lượng phòng", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyCount();
    },[ownerId,token]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <p>{propertyCount}</p>
        </>
    );

};
export default PropertyCount;