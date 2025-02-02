import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './StudentDashboard.css';

import { Outlet } from "react-router-dom";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('User is null, redirecting to login...');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    console.log('Starting logout...');
    console.log('Current user before logout:', user);
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
    console.log('Token removed:', localStorage.getItem('user'));
    navigate('/login');
    console.log('Navigating to /login');
  };

  return (
    <div className="student-dashboard">
      <TopBar toggleSidebar={toggleSidebar} toggleHistory={toggleHistory} onLogout={handleLogout} />
      <div className="row-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Outlet context={{ toggleSidebar, handleLogout }} />

      </div>
    </div>
  );
};

export default StudentDashboard;
