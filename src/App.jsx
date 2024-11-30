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

import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <AuthProvider>
        
        
        
        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="Student">
                <StudentDashboard/>
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
          <Route path="/quiz" element={<QuizPage  />} />
          <Route path="/ranking" element={<Ranking toggleSidebar={toggleSidebar} />} />
          <Route path="/test/:testId" element={<MultipleChoiceLayout />}/>
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
