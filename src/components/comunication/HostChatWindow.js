import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // Sử dụng Client từ @stomp/stompjs

const HostChatWindow = () => {
    const { chatRoomId, propertyId } = useParams();
    const [messages, setMessages] = useState([]);  // Mảng lưu tin nhắn
    const [newMessage, setNewMessage] = useState('');  // Tin nhắn mới
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    let stompClient = null; // Khởi tạo WebSocket

    // Hàm kết nối tới WebSocket
    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws'); // URL kết nối
        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str), // Debug nếu cần thiết
            onConnect: onConnected,
            onStompError: onError,
        });
        stompClient.activate(); // Kích hoạt kết nối WebSocket
    };

    // Hàm xử lý khi kết nối WebSocket thành công
    const onConnected = () => {
        // Đăng ký kênh lắng nghe tin nhắn mới từ WebSocket
        stompClient.subscribe(`/topic/notifications/${userId}`, onMessageReceived);
    };

    // Hàm xử lý khi có lỗi kết nối
    const onError = (err) => {
        console.error("Lỗi kết nối WebSocket:", err);
    };

    // Hàm xử lý khi nhận tin nhắn mới qua WebSocket
    const onMessageReceived = (payload) => {
        const newMessage = JSON.parse(payload.body);  // Parse dữ liệu từ payload
        setMessages((prevMessages) => [...prevMessages, newMessage]);  // Cập nhật tin nhắn vào state
    };

    useEffect(() => {
        // Load lịch sử tin nhắn từ server khi component được render
        const fetchChatHistory = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/chat/hostChatRoom', null, {
                    params: { chatRoomId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && Array.isArray(response.data.messages)) {
                    setMessages(response.data.messages);  // Cập nhật tin nhắn cũ
                }
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử phòng chat:", error);
            }
        };

        fetchChatHistory();
        connectWebSocket();  // Kết nối WebSocket khi component được render

        return () => {
            if (stompClient !== null) {
                stompClient.deactivate();  // Ngắt kết nối khi component bị hủy
            }
        };
    }, [chatRoomId, propertyId]);

    // Hàm gửi tin nhắn
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:8080/api/chat/sendMessage', {
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

    return (
        <div>
            <h2>Phòng Chat {chatRoomId}</h2>
            <Link className="text-decoration-none btn btn-primary" to="/host/dashboard">Quay lại</Link>
            <div className="chat-messages">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div key={index} className="chat-message">
                            <strong>{message.sender?.username}: </strong>
                            <span>{message.content}</span>
                            <small> ({new Date(message.sentAt).toLocaleTimeString()})</small>
                        </div>
                    ))
                ) : (
                    <p>Không có tin nhắn nào.</p>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage}>Gửi</button>
            </div>
        </div>
    );
};

export default HostChatWindow;
