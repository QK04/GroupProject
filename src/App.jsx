import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import MultipleChoiceLayout from './components/test'; 
import QuizPage from './components/quiz';
import Ranking from './components/Ranking';
import TopBar from './components/Topbar';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import transparentLogo from './assets/transparent.png';
import HistoryLogo from './assets/history.png';
import './App.css';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleHistory = () => setHistoryOpen((prev) => !prev);

  // Determine if current route is Ranking-related
  const ChatbotPaths = ['/student-dashboard'];
  const isChatbot = ChatbotPaths.includes(window.location.pathname);

  // Dynamic props for TopBar's History button
  const historyProps = isChatbot
    ? { icon: HistoryLogo, action: toggleHistory } // Disable History on ranking pages
    : { icon: transparentLogo, action: null };

  return (
    <Router>
      <AuthProvider>
        {/* TopBar and Sidebar */}
        <TopBar toggleSidebar={toggleSidebar} historyProps={historyProps} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="Student">
                <StudentDashboard toggleHistory={toggleHistory}
                isHistoryOpen={isHistoryOpen}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute requiredRole="Teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/test/:testId" element={<MultipleChoiceLayout />}/>
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
