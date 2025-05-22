import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { User, AuthState } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string, verificationCode: string) => Promise<{ success: boolean }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, error, loginStart, loginSuccess, loginFailure, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    // 로컬 스토리지에서 토큰만 로드
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // 토큰이 있으면 사용자 정보를 서버에서 가져옴
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/me', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      const userData: User = {
        id: data.id,
        user_name: data.userName,
        email: data.email,
        email_verified: data.emailVerified,
        role: data.role,
        created_at: data.createdAt,
      };

      loginSuccess(userData, localStorage.getItem('token') || '');
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      loginStart(); // 로그인 시작 상태 설정
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username: email, password })
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      if (!data.token) {
        console.error('로그인 응답에 토큰이 없습니다:', data);
        throw new Error('인증 토큰이 없습니다');
      }
      
      // 스토어에 사용자 정보와 토큰 저장
      loginSuccess(data, data.token);
      
      // localStorage에는 토큰만 저장 (인증 유지용)
      localStorage.setItem('token', data.token);
    } catch (err) {
      console.error('Login error:', err);
      loginFailure(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다');
      throw err;
    }
  };

  const logout = () => {
    storeLogout();
    localStorage.removeItem('token');
  };

  const signup = async (username: string, email: string, password: string, verificationCode: string) => {
    try {
      loginStart();

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          email: email,
          password: password,
          code: verificationCode
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 시 사용자 정보 저장
      const userData: User = {
        id: data.id,
        user_name: data.userName,
        email: data.email,
        email_verified: data.emailVerified,
        role: data.role,
        created_at: data.createdAt,
      };
      
      // 스토어에만 정보 저장
      loginSuccess(userData, data.token);
      
      // localStorage에는 토큰만 저장 (인증 유지용)
      localStorage.setItem('token', data.token);
      
      console.log('회원가입 성공:', userData.email);

      return { success: true };
    } catch (err) {
      loginFailure(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      return { success: false };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 