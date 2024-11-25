import React, { useEffect } from 'react';
import { authMiddleware } from '../middleware/authMiddleware';

const ProtectedPage = () => {
  useEffect(() => {
    // Kiểm tra quyền truy cập (middleware)
    const isAuthenticated = authMiddleware();
    if (!isAuthenticated) {
      return; // Nếu không xác thực, sẽ chuyển hướng tới trang đăng nhập
    }

    // Nếu đã xác thực, tiếp tục với logic trang bảo vệ
    console.log('User is authenticated!');
  }, []);

  return (
    <div>
      <h2>This is a protected page</h2>
      <p>Only accessible by logged-in users.</p>
    </div>
  );
};

export default ProtectedPage;
