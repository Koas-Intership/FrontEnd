import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://test-latest-yibd.onrender.com',
  withCredentials: true,
});
