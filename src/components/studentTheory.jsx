import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import "./TeacherDashboard.css";
import StudentSubjectCard from './studentSubjectCard';

const StudentTheory = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="app">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="dashboard-content">
        <StudentSubjectCard /> 
      </div>
    </div>
  );
};

export default StudentTheory;
