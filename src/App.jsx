import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/Topbar';
import ChatArea from './components/ChatArea';
import History from './components/SidebarItem/History';
import Login from './components/login';
import Register from './components/register';
import StudentDashboard from './components/StudentDashboard'; 
import TeacherDashboard from './components/TeacherDashboard'; 
import MultipleChoiceLayout from './components/test'; 
import ProtectedPage from './components/ProtectedPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/quiz';
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

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Debugging - log user state and localStorage to check data
  useEffect(() => {
    console.log("User state updated:", user);
    console.log("User data in localStorage:", localStorage.getItem('user'));
  }, [user]);

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
          path="/register"
          element={<Register />} 
        />
        <Route
          path="/student-dashboard"
          element={
            user && user.role === 'Student' ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            user && user.role === 'Teacher' ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
          <Route
          path="/multiple-choice"
          element={
            user ? (
              <MultipleChoiceLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz"
          element={
            user ? (
              <QuizPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/protected" element={<ProtectedPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
