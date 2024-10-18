import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ onClose}) => {
    const [chatRoomId, setChatRoomId] = useState(null);
    const [message, setMessage] = useState([]);
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const propertyId = localStorage.getItem('propertyId')
    const [inputMessage, setInputMessage] = useState('');
    const chatBodyRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        console.log('propertyId:', propertyId);
        const openChatRoom = async () => {
            try {
                // Gọi API để mở hoặc lấy ChatRoom
                const response = await axios.post('http://localhost:8080/api/chat/openChatRoom', null, {
                    params: { propertyId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChatRoomId(response.data.id);  // Lưu chatRoomId vào state
                localStorage.setItem('chatRoomId', response.data.id);

                await fetchChatHistory(response.data.id);
            } catch (error) {
                console.error('Error opening chat room:', error);
            }
        };

        openChatRoom();
    }, [propertyId]);

    const fetchChatHistory = async (chatRoomId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/chat/history', {
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

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '') {
            const newMessage = {
                content: inputMessage,
                senderId: userId,  // Lấy từ thông tin đăng nhập
                chatRoomId,  // Gửi kèm ID của ChatRoom
            };

            try {
                // Gửi tin nhắn đến backend để lưu
                const response = await axios.post('http://localhost:8080/api/chat/sendMessage', newMessage, {
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

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    return (
        <div className="chat-window mb-2">
            <div className="chat-header">
                <span>Chat với chủ nhà</span>
                <button className="btn btn-danger" onClick={onClose}>x</button>
            </div>

            <div className="chat-body" ref={chatBodyRef}>
                {message.map((message, index) => (
                    <div
                        key={index} className={`chat-message ${message.sender === 'user' ? 'user' : 'other'}`}
                    >
                        {message.text}
                    </div>
                ))}
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
