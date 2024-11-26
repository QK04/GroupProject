import React, { useState } from 'react';
import TopBar from './Topbar';
import Sidebar from './Sidebar';
import History from './SidebarItem/History';
import ChatArea from './ChatArea';
import './StudentDashboard.css'; // Create a separate CSS for dashboard styles

const Dashboard = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState('Chat 1');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState({
    'Chat 1': [],
    'Chat 2': [],
    'Chat 3': [],
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
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
