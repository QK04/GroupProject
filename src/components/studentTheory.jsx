import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import "./studentTheory.css";
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
    <div className="student-theory">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="student-dashboard-content">
        <StudentSubjectCard /> 
      </div>
    </div>
  );
};

export default StudentTheory;
