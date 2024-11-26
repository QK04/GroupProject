import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import ChatArea from './ChatArea';
import History from './SidebarItem/History';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState('Chat 1');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState({
    'Chat 1': [],
    'Chat 2': [],
    'Chat 3': [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("StudentDashboard: User data:", user);
    if (!user) {
      console.log('User is null, redirecting to login...');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Không render dashboard nếu user null
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatSelect = (chatName) => {
    setCurrentChat(chatName);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (message) => {
    setChatHistories((prev) => ({
      ...prev,
      [currentChat]: [...prev[currentChat], message],
    }));
  };

  const toggleHistory = () => setIsHistoryOpen(!isHistoryOpen);

  const handleLogout = () => {
    console.log('Starting logout...');
    console.log('Current user before logout:', user);
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
    console.log('Token removed:', localStorage.getItem('user'));
    navigate('/login');
    console.log('Navigating to /login');
  };

  return (
    <div className="student-dashboard">
      <TopBar toggleSidebar={toggleSidebar} toggleHistory={toggleHistory} onLogout={onLogout} />
      <div className="row-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <History isOpen={isHistoryOpen} onChatSelect={handleChatSelect} />
        <ChatArea
          isOpen={isHistoryOpen}
          currentChat={currentChat}
          messages={chatHistories[currentChat]}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
