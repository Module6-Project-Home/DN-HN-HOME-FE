import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/api/chat-websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,  // Tự động kết nối lại nếu mất kết nối
            onConnect: () => {
                console.log('Connected');
                client.subscribe('/topic/messages', (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error(`Broker reported error: ${frame.headers['message']}`);
                console.error(`Additional details: ${frame.body}`);
            },
        });

        client.activate();  // Kích hoạt kết nối STOMP

        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();  // Hủy kích hoạt khi component bị gỡ bỏ
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && newMessage.trim()) {
            const chatMessage = {
                sender: 'user1',  // Thay bằng tên người dùng
                recipient: 'user2',  // Thay bằng người nhận
                content: newMessage,
            };
            stompClient.publish({
                destination: '/app/sendMessage',  // Kênh gửi tin nhắn trên server
                body: JSON.stringify(chatMessage),
            });
            setNewMessage('');
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <h2>Chat</h2>
            <div className="">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
