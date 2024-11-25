import { useNavigate } from 'react-router-dom';

export const authMiddleware = () => {
  const navigate = useNavigate();
  
  // Lấy token từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Nếu không có user (chưa đăng nhập), điều hướng tới trang đăng nhập
  if (!user || !user.access_token) {
    navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập
    return false; // Quay lại để không thực hiện yêu cầu tiếp theo
  }
  
  // Kiểm tra token hợp lệ (hoặc kiểm tra thời gian hết hạn nếu cần)
  const isValidToken = validateToken(user.access_token); // Giả sử có hàm validateToken
  if (!isValidToken) {
    navigate('/login'); // Token không hợp lệ, yêu cầu đăng nhập lại
    return false;
  }
  
  // Nếu token hợp lệ, tiếp tục
  return true;
};

// Giả lập hàm kiểm tra tính hợp lệ của token
const validateToken = (token) => {
  // Ở đây bạn có thể kiểm tra thời gian hết hạn hoặc token hợp lệ thông qua jwt-decode hoặc API
  // Giả sử token hợp lệ
  return true;
};
