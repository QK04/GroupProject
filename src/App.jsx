import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/Topbar';
import ChatArea from './components/ChatArea';
import History from './components/SidebarItem/History';
import Login from './components/login';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState('Chat 1');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState({
    'Chat 1': [],
    'Chat 2': [],
    'Chat 3': [],
  });
  const [user, setUser] = useState(null); // Track logged-in user

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatSelect = (chatName) => {
    setCurrentChat(chatName);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (message) => {
    setChatHistories((prevHistories) => ({
      ...prevHistories,
      [currentChat]: [...prevHistories[currentChat], message],
    }));
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={(user) => setUser(user)} />} // Pass `setUser` to handle login
        />
        <Route
          path="/"
          element={
            user ? (
              <div className="app">
                <TopBar
                  toggleSidebar={toggleSidebar}
                  toggleHistory={toggleHistory}
                  onLogout={handleLogout}
                />
                
                <div className='row-container'>
                  <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                  <History
                    isOpen={isHistoryOpen}
                    onChatSelect={handleChatSelect}
                  />
                  <ChatArea
                    isOpen={isHistoryOpen}
                    currentChat={currentChat}
                    messages={chatHistories[currentChat]}
                    onSendMessage={handleSendMessage}
                />
                
                </div>
                
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
