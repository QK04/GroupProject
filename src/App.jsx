import React from 'react';
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

import FullListTest from './components/FullListTest';
import ViewTest from './components/ViewTest';
import TestCreationOptions from './components/TestCreationOptions';
import ManualCreateTest from './components/ManualCreateTest';
import RandomlyCreateTest from './components/RandomlyCreateTest';
import Ranking from './components/Ranking';

import SubjectCard from './components/SubjectCard.jsx';
import QuestionBank from './components/QuestionBank.jsx';


const App = () => {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="Student">
                <StudentDashboard />
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
          <Route
            path="/QuestionBank"
            element={<QuestionBank/>}
          />
          <Route
            path="/SubjectCard"
            element={<SubjectCard />}
          />
          <Route
            path="/quiz"
            element={<QuizPage />}
          />

          <Route
            path="/Ranking"
            element={<Ranking />}
          />

          <Route
            path="/FullListTest"
            element={<FullListTest />}
          />
          <Route
            path="/ViewTest/:testId"
            element={<ViewTest />}
          />

          <Route
          path="/TestCreationOptions"
          element={<TestCreationOptions />} 
          />

          <Route
            path="/test/:testId"
            element={<MultipleChoiceLayout />}
          />    

          <Route 
          path="/ManualCreateTest" 
          element={<ManualCreateTest />} 
          />

          <Route 
          path="/RandomlyCreateTest" 
          element={<RandomlyCreateTest />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/subject/:subjectId" element={<ChapterList />} />
          <Route path="/chapter/:chapterId" element={<ChapterDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
