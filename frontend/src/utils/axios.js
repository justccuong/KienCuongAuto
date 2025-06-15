import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // ❗Quan trọng để gửi cookie httpOnly
});

export default api;