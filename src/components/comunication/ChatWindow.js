import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import './ChatWindow.css';
import {API_URL} from "../constants/constants";

const ChatWindow = ({ onClose}) => {
    const [chatRoomId, setChatRoomId] = useState(localStorage.getItem('chatRoomId') || null);
    const [message, setMessage] = useState([]);
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const propertyId = localStorage.getItem('propertyId')
    const [inputMessage, setInputMessage] = useState('');
    const chatBodyRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        console.log('propertyId:', propertyId);
        console.log('Chat Room ID 1:', chatRoomId);

        const openChatRoom = async () => {
            console.log("open chat");
            try {
                const response = await axios.post(`${API_URL}/api/chat/openChatRoom`, null, {
                    params: { propertyId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // In toàn bộ response để kiểm tra cấu trúc
                console.log('API response:', response.data);
                console.log(response.data.chatRoom.id);

                const chatRoomIdFromApi = response.data.chatRoom.id;
                setChatRoomId(chatRoomIdFromApi);  // Lưu chatRoomId vào state
                localStorage.setItem('chatRoomId', chatRoomIdFromApi);  // Lưu chatRoomId vào localStorage
                console.log('Chat Room ID:', chatRoomIdFromApi);

                // Lấy danh sách tin nhắn từ phản hồi
                const chatMessages = response.data.chatMessages; // Giả sử API trả về danh sách tin nhắn
                setMessage(chatMessages); // Cập nhật state với danh sách tin nhắn
            } catch (error) {
                console.error('Error opening chat room:', error);
            }
        };
        openChatRoom();
    }, [propertyId, chatRoomId, token]);

    const fetchChatHistory = async (chatRoomId) => {
        try {
            const response = await axios.get(`${API_URL}/api/chat/history`, {
                params: { chatRoomId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (chatRoomId) {
                fetchChatHistory(chatRoomId);
            }
        }, 10000);

        return () => clearInterval(intervalId);
    }, [chatRoomId, token]);

    const handleSendMessage = async () => {
        const storedChatRoomId = localStorage.getItem('chatRoomId');
        if (inputMessage.trim() !== '' && storedChatRoomId) {
            const newMessage = {
                content: inputMessage,
                senderId: userId,  // Lấy từ thông tin đăng nhập
                chatRoomId: storedChatRoomId,
            };

            try {
                // Gửi tin nhắn đến backend để lưu
                const response = await axios.post(`${API_URL}/api/chat/sendMessage`, newMessage, {
                    headers: {
                        Authorization: `Bearer ${token}` // Đảm bảo thêm token vào header
                    }
                });
                setMessage([...message, response.data]); // Cập nhật state với tin nhắn mới từ backend
                setInputMessage(''); // Xóa input sau khi gửi
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
            e.preventDefault();
        }
    };

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();  // Tự động cuộn khi mảng messages thay đổi
    }, [message]);

    useEffect(() => {
        scrollToBottom();  // Tự động cuộn khi cửa sổ chat được mở
    }, []);

    return (
        <div className="chat-window mb-2">
            <div className="chat-header">
                <span>Chat với chủ nhà</span>
                <button className="btn btn-danger" onClick={onClose}>x</button>
            </div>

            <div className="chat-body" >
                <>
                    {message.map((message, index) => (
                        <div
                            key={index} className={`chat-message ${message.sender === 'user' ? 'user' : 'other'}`}
                        >
                            <strong>{message.sender?.username}: </strong>
                            <span>{message.content}</span>
                            <small> ({new Date(message.sentAt).toLocaleTimeString()})</small>
                        </div>
                    ))}
                    <div ref={chatBodyRef}/>
                </>

            </div>
            <div ref={bottomRef}/>

            <div className="chat-footer">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatWindow;
