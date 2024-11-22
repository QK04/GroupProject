import React, { useState, useEffect, useRef } from 'react';
import './ChatArea.css';
import { Divider } from '@mui/material';

const ChatArea = ({ currentChat, messages, onSendMessage, isOpen}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage({ text: input, sender: 'user' });
      setInput('');

      // Example bot response for demonstration purposes
      setTimeout(() => {
        onSendMessage({ text: 'Hello, this is a USTH Chatbot reply', sender: 'bot' });
      }, 500);

    }
  }
  ;

  return (
    <div className={`chat-area ${isOpen ? 'with-history' : ''}`}>
      <h2 className='current_chat'>{currentChat}</h2>
      <div className='divider'></div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className='send_button  ' onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
