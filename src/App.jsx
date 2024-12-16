import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import MultipleChoiceLayout from "./components/test"; 
import QuizPage from "./components/quiz";
import "./App.css";
import UserProfile from "./components/UserProfile.jsx";
import ChapterList from "./components/ChapterList.jsx";
import ChapterDetail from "./components/ChapterDetail.jsx";
import Ranking from './components/Ranking';
import TestDetailsPage from './components/TestDetailsPage';
import StudentTheory from './components/studentTheory';
import ChapterListStudent from './components/ChapterListStudent';
import ResultPage from './components/ResultPage.jsx';

import './App.css';
import ChapterDetailStudent from './components/ChapterDetailStudent.jsx';

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
          <Route path="/ranking" element={<Ranking toggleSidebar={toggleSidebar} />} />4
          <Route path="/test/:testId/details" element={<TestDetailsPage />} />
          <Route path="/test/:testId" element={<MultipleChoiceLayout />}/>
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/results/:testId" element={<ResultPage />} />
          <Route path='/theory' element={<StudentTheory/>}/>
          <Route
            path="/subject/:subjectId"
            element={
              localStorage.getItem("user") &&
              JSON.parse(localStorage.getItem("user")).role === "Teacher" ? (
                <ChapterList />
              ) : (
                <ChapterListStudent />
              )
            }
          />
          <Route
            path="/chapter/:chapterId"
            element={
              localStorage.getItem("user") &&
              JSON.parse(localStorage.getItem("user")).role === "Teacher" ? (
                <ChapterDetail />
              ) : (
                <ChapterDetailStudent />
              )
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
