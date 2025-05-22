import api from './api';
import { User } from '@/types';

// 인터페이스 정의
interface AuthResponse {
  user: User;
  token: string;
}

// 로그인 API
export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || '로그인에 실패했습니다.'
    );
  }
};

// 회원가입 API
export const signupApi = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/signup', { username, email, password });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || '회원가입에 실패했습니다.'
    );
  }
};

// 카카오 로그인 API
export const kakaoLoginApi = async (code: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/kakao', { code });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || '카카오 로그인에 실패했습니다.'
    );
  }
};

// 애플 로그인 API
export const appleLoginApi = async (code: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/apple', { code });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || '애플 로그인에 실패했습니다.'
    );
  }
}; 