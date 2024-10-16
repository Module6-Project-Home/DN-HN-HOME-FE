import React, {useEffect, useRef, useState} from 'react';
import './ChatWindow.css';

const ChatWindow = ({ onClose }) => {
    const [message, setMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatBodyRef = useRef(null); // Tham chiếu đến phần hiển thị tin nhắn
    const bottomRef = useRef(null); // Tham chiếu đến phần cuối cùng của chat

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            setMessage([...message, { text: inputMessage, sender: 'user' }]);
            setInputMessage(''); // Reset ô nhập sau khi gửi
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
                {message.map((msg, index) => (
                    <div
                        key={index} className={`chat-message ${message.sender === 'user' ? 'user' : 'other'}`}
                    >
                        {msg.text}
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
