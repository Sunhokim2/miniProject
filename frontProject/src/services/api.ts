import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useAuthStore from '@/store/useAuthStore';

// API 기본 URL
const BASE_URL = 'http://localhost:3000/api';

// axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 토큰 만료 처리 (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default api; 