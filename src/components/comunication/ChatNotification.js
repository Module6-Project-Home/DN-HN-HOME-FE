import React, {useState, useEffect} from 'react';
import {Dropdown, Button} from 'react-bootstrap';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Link} from 'react-router-dom';
import axios from 'axios';
import HostChatWindow from "./HostChatWindow";

const ChatNotification = () => {
    const [chatRooms, setChatRooms] = useState([]);  // Danh sách phòng chat
    const [unreadMessages, setUnreadMessages] = useState({}); // Đếm số tin nhắn chưa đọc cho mỗi phòng
    const [hasNewMessage, setHasNewMessage] = useState(false); // Kiểm tra có tin nhắn mới
    const token = localStorage.getItem('jwtToken');
    const [showChat, setShowChat] = useState(false);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null); // Lưu phòng chat được chọn
    const [activeChatRoomId, setActiveChatRoomId] = useState(null);

    // Kết nối WebSocket khi component được render
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/chat/chatRooms', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setChatRooms(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng chat:", error);
            }
        };

        fetchChatRooms();  // Gọi hàm khi component được render

        const socket = new SockJS('http://localhost:8080/api/chat/chat-websocket');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');

            // Đăng ký nhận tin nhắn từ phòng chat
            stompClient.subscribe('/user/queue/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log('Received new message: ', receivedMessage);

                // Cập nhật phòng chat có tin nhắn mới nhất
                setChatRooms((prevRooms) => {
                    const updatedRooms = prevRooms.filter(room => room.id !== receivedMessage.chatRoomId);
                    return [{id: receivedMessage.chatRoomId, property: receivedMessage.property, user: receivedMessage.user}, ...updatedRooms];
                });

                // Đánh dấu tin nhắn chưa đọc
                setUnreadMessages((prevUnread) => ({
                    ...prevUnread,
                    [receivedMessage.chatRoomId]: (prevUnread[receivedMessage.chatRoomId] || 0) + 1,
                }));

                setHasNewMessage(true);
            });
        });

        return () => {
            stompClient.disconnect(() => {
                console.log('WebSocket Disconnected');
            });
        };
    }, []);

    const handleOpenChat = (roomId) => {
        setActiveChatRoomId(roomId); // Cập nhật phòng chat đang hoạt động
    };

    const handleCloseChat = () => {
        setActiveChatRoomId(null); // Đóng phòng chat
    };

    return (
        <div>
            {/* Dropdown danh sách phòng chat */}
            <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-chat-notifications">
                    <i className="fas fa-envelope"></i>
                    {hasNewMessage && <span className="badge bg-danger">!</span>} {/* Hiển thị ! nếu có tin nhắn mới */}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: '300px' }}>
                    {chatRooms.length > 0 ? (
                        chatRooms.map((room) => (
                            <div key={room.chatRoom.id} className="dropdown-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span style={{
                                        display: 'inline-block',
                                        maxWidth: '150px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {room.chatRoom?.property?.name || "No Property"} - {room.chatRoom?.user?.username || "No User"}
                                        {unreadMessages[room.chatRoom.id] > 0 && (
                                            <span className="badge bg-danger ms-2">{unreadMessages[room.chatRoom.id]}</span> // Hiển thị số tin nhắn chưa đọc
                                        )}
                                    </span>
                                    <Button
                                        className="btn btn-primary ms-2"
                                        onClick={() => handleOpenChat(room.chatRoom.id)} // Mở chat window ngay tại chỗ
                                    >
                                        💬
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Dropdown.Item disabled>Không có phòng chat nào</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            {activeChatRoomId && (
                <HostChatWindow chatRoomId={activeChatRoomId} onClose={handleCloseChat} />
            )}
        </div>
    );
};

export default ChatNotification;
