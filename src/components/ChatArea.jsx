import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import History from './SidebarItem/History';
import historyIcon from "../assets/history.png";
import './ChatArea.css';

const ChatArea = () => {
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState('Chat 1'); 
  const [chatHistories, setChatHistories] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [currentConversation, setCurrentConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const historyRef = useRef(null);
  const navigate = useNavigate();
  const { conversationId } = useParams(); // Extract conversationId from URL
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Fetch chat history on component mount or when conversationId changes
  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId);
      fetchChatHistory(conversationId);
    }
  }, [conversationId]);

  // Scroll to the last message when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, currentChat]);
  

  // Fetch chat history from the API
  const fetchChatHistory = async (conversationId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chatbot/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Response: ", response);
        const mes = JSON.parse(response.data.body);
        const messages = mes.messages;
        console.log("Messages: ", messages);
        const chatKey = `Chat ${conversationId}`;

        setChatHistories((prev) => ({
          ...prev,
          [chatKey]: messages.map((msg) => ({
            text: msg.message_text,
            sender: msg.sender,
          })),
        }));

        setCurrentChat(chatKey);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const startNewConversation = async () => {
    if (currentConversation) return;

    try {
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user_id
        : null;

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chatbot/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = JSON.parse(response.data.body);
      const newConversationId = responseBody.conversation_id;

      setCurrentConversation(newConversationId);
      setChatHistories((prev) => ({
        ...prev,
        [`Chat ${Object.keys(prev).length + 1}`]: [],
      }));
      setCurrentChat(`Chat ${Object.keys(chatHistories).length + 1}`);
      navigate(`/chat/${newConversationId}`);
    } catch (error) {
      console.error("Error starting new conversation:", error);
    }
  };

  const handleSendMessage = (message) => {
    setChatHistories((prev) => ({
      ...prev,
      [currentChat]: [...prev[currentChat], message],
    }));
  };

  const handleSend = async () => {
    if (input.trim()) {
      if (!currentConversation) {
        await startNewConversation();
      }

      const userMessage = { text: input, sender: 'user' };
      handleSendMessage(userMessage);
      setInput('');

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chatbot/conversations/${currentConversation}`,
          {
            sender: 'user',
            text: input,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const botResponse = await fetch(
            '   https://a555-42-114-178-230.ngrok-free.app/api/message',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: input }),
            }
          );

          if (!botResponse.ok) {
            throw new Error(`Error: ${botResponse.status} ${botResponse.statusText}`);
          }

          const botResponseData = await botResponse.json();
          if (botResponseData.text) {
            handleSendMessage({ text: botResponseData.text, sender: 'bot' });

            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/chatbot/conversations/${currentConversation}`,
              {
                sender: 'bot',
                text: botResponseData.text,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } else {
            handleSendMessage({ text: 'Error: Invalid response from bot.', sender: 'bot' });
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
        handleSendMessage({ text: 'Error: Unable to connect to the chatbot server.', sender: 'bot' });
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setIsHistoryOpen(false);
      }
    };

    if (isHistoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHistoryOpen]);
  const toggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleChatSelect = (conversationId) => {
    navigate(`/chat/${conversationId}`);
    setIsHistoryOpen(false);
  };

  return (
    <div className="chat-area-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <div className="row-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="chat-area">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <h2 className="chat-area-current-chat">{currentChat}</h2>
              <div className="chat-header-actions">
                {/* History Icon */}
                <img
                  src={historyIcon}
                  alt="History"
                  className="history-icon"
                  onClick={toggleHistory}
                />
                {/* Start New Chat Button */}
                <button className="start-new-chat-button" onClick={startNewConversation}>
                  + Start New Chat
                </button>
              </div>
            </div>
          </div>

          {/* History Component */}
          {isHistoryOpen && (
            <div className="chat-history-panel" ref={historyRef}>
              <History isOpen={isHistoryOpen} onChatSelect={handleChatSelect} />
            </div>
          )}
          

          {/* Chat Messages */}
          <div className="chat-area-messages">
            {chatHistories[currentChat]?.map((msg, index) => (
              <div
                key={index}
                className={`chat-area-message ${
                  msg.sender === 'bot' ? 'chat-area-message-bot' : 'chat-area-message-user'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-area-input-area">
            <input
              type="text"
              className="chat-area-input"
              placeholder="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-area-send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
