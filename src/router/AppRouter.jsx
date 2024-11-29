import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
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
    </Routes>
  </Router>
);

export default AppRouter;
