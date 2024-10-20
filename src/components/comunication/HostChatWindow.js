import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {API_URL} from "../constants/constants"; // Sử dụng Client từ @stomp/stompjs

const HostChatWindow = ({onClose, chatRoomId}) => {
    const {propertyId} = useParams();
    const [messages, setMessages] = useState([]);  // Mảng lưu tin nhắn
    const [newMessage, setNewMessage] = useState('');  // Tin nhắn mới
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const messagesEndRef = useRef(null);

    const fetchChatHistory = async () => {
        try {
            console.log("chatRoomId: ", chatRoomId);
            const response = await axios.get(`${API_URL}/api/chat/hostChatRoom`, {
                params: {chatRoomId},
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("response", response.data);
            if (response.data && Array.isArray(response.data.chatMessages)) {
                setMessages(response.data.chatMessages);  // Cập nhật tin nhắn cũ
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử phòng chat:", error);
        }
    };

    useEffect(() => {
        fetchChatHistory();
        const intervalId = setInterval(() => {
            fetchChatHistory();  // Tải lại tin nhắn sau mỗi 10 giây
        }, 10000);

        return () => clearInterval(intervalId);
    }, [chatRoomId, token]);

    // Hàm gửi tin nhắn
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await axios.post(`${API_URL}/api/chat/sendMessage`, {
                senderId: userId,
                chatRoomId: chatRoomId,
                content: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Cập nhật tin nhắn mới vào state
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setNewMessage('');  // Xóa input sau khi gửi
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault();
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        scrollToBottom();  // Tự động cuộn khi mảng messages thay đổi
    }, [messages]);

    useEffect(() => {
        scrollToBottom();  // Tự động cuộn khi cửa sổ chat được mở
    }, []);

    return (
        <div className="chat-window mb-2">
            <div className="chat-header">
                <span>Phòng Chat {chatRoomId}</span>
                <button className="btn btn-danger" onClick={onClose}>x</button>
            </div>

            {/*<Link className="text-decoration-none btn btn-primary" to="/host/dashboard">Quay lại</Link>*/}
            <div className="chat-body">
                {Array.isArray(messages) && messages.length > 0 ? (
                    <>
                        {messages.map((message, index) => (
                            <div key={index} className="chat-message">
                                <strong>{message.sender?.username}: </strong>
                                <span>{message.content || 'Không có nội dung'}</span>
                                <small> ({message.sentAt ? new Date(message.sentAt).toLocaleTimeString() : 'Unknown time'})</small>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </>

                ) : (
                    <p>Không có tin nhắn nào.</p>
                )}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={sendMessage}>Gửi</button>
            </div>
        </div>
    );
};

export default HostChatWindow;
