import React, {useState, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Link} from 'react-router-dom';
import axios from 'axios';

const ChatNotification = () => {
    const [chatRooms, setChatRooms] = useState([]);  // Danh sách phòng chat
    const [unreadMessages, setUnreadMessages] = useState({}); // Đếm số tin nhắn chưa đọc cho mỗi phòng
    const [showModal, setShowModal] = useState(false); // Hiển thị modal danh sách chat
    const [hasNewMessage, setHasNewMessage] = useState(false); // Kiểm tra có tin nhắn mới
    const token = localStorage.getItem('jwtToken');

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

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            {/* Nút tin nhắn */}
            <Button variant="dark" onClick={handleShowModal}>
                <i className="fas fa-envelope"></i> {/* Biểu tượng tin nhắn */}
                {hasNewMessage && <span className="badge bg-danger">!</span>} {/* Hiển thị ! nếu có tin nhắn mới */}
            </Button>

            {/* Modal danh sách phòng chat */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách phòng chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {chatRooms.length > 0 ? (
                        <ul className="list-group">
                            {chatRooms.map((room) => (
                                <li key={room.chatRoom.id}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    <Link className="text-decoration-none" to={`/host/chat-room/${room.chatRoom.id}`}>
                                        {room.chatRoom?.property?.name || "No Property"} - {room.chatRoom?.user?.username || "No User"}
                                    </Link>
                                    {unreadMessages[room.chatRoom.id] > 0 && (
                                        <span className="badge bg-danger">{unreadMessages[room.chatRoom.id]}</span> // Hiển thị số tin nhắn chưa đọc
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có phòng chat nào</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChatNotification;
