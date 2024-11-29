import React, { useState, useEffect, useRef } from 'react';
import './ChatArea.css';
import { Divider } from '@mui/material';

const ChatArea = ({ currentChat, messages, onSendMessage, isOpen }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      // User question
      onSendMessage({ text: input, sender: 'user' });
      setInput('');

      setTimeout(() => {
        // Chatbot reply
        onSendMessage({ text: 'Hello, this is a USTH Chatbot reply', sender: 'bot' });
      }, 500);
    }
  };

  return (
    <div className={`chat-area ${isOpen ? 'chat-area-with-history' : ''}`}>
      <h2 className="chat-area-current-chat">{currentChat}</h2>
      <div className="chat-area-divider"></div>
      <div className="chat-area-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-area-message chat-area-message-${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-area-input-area">
        <input
          type="text"
          className="chat-area-input"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="chat-area-send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
