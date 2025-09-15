import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://test-latest-yibd.onrender.com',
});

// 모든 요청에 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isAuthPath =
    url.includes("/api/user/login") || url.includes("/api/user/register");
  if (!isAuthPath) {
    const t = localStorage.getItem("access_token");
    if (t) config.headers.Authorization = `Bearer ${t}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});