import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to the Teacher Dashboard</h2>
      <p>Here is your teacher content.</p>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TeacherDashboard;
