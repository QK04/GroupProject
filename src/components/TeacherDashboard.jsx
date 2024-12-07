import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";
import SubjectCard from "./SubjectCard";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate(); // Khởi tạo navigate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Remove user info from localStorage
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Function to handle Test navigation
  const handleTestNavigation = () => {
    navigate("/FullListTest"); // Điều hướng đến FullListTest
    toggleSidebar(); // Đóng Sidebar sau khi chuyển hướng
  };

  return (
    <div className="app">
      {/* TopBar stays at the top */}
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onTestClick={handleTestNavigation} // Gửi function điều hướng tới Sidebar
      />

      {/* Main Content */}
      <div className="dashboard-content">
        <SubjectCard /> {/* Default content */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
