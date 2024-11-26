import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import StudentDashboard from "./components/StudentDashboard"; 
import TeacherDashboard from "./components/TeacherDashboard"; 
import MultipleChoiceLayout from "./components/test"; 
import ProtectedPage from "./components/ProtectedPage";
import Dashboard from "./components/Dashboard";
import QuizPage from "./components/quiz";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null); // Track logged-in user

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={(user) => setUser(user)} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student-dashboard"
          element={
            user && user.role === "Student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            user && user.role === "Teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz"
          element={user ? <QuizPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/test/:testId"
          element={user ? <MultipleChoiceLayout /> : <Navigate to="/login" />}
        />
        <Route path="/protected" element={<ProtectedPage />} />
        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
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
