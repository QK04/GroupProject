import axios from 'axios';

// Tạo instance axios với header Authorization
const apiMiddleware = axios.create();

// Middleware thêm Authorization header cho mỗi yêu cầu
apiMiddleware.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access_token) {
    config.headers['Authorization'] = `Bearer ${user.access_token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiMiddleware;
