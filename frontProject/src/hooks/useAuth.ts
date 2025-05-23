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
  setAuth: (auth: { token: string; email: string; name?: string; isAuthenticated: boolean }) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, error, loginStart, loginSuccess, loginFailure, logout: storeLogout } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          await fetchUserInfo();
        } catch (err) {
          console.error('초기 인증 실패:', err);
          localStorage.removeItem('token');
          storeLogout();
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

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

      loginSuccess(userData, token);
      return true;
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      throw err;
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
      
      // 백엔드 응답을 User 타입에 맞게 변환
      const userData: User = {
        id: data.id,
        user_name: data.userName,
        email: data.email,
        email_verified: data.emailVerified,
        role: data.role,
        created_at: data.createdAt || new Date().toISOString(),
      };
      
      // 스토어에 사용자 정보와 토큰 저장
      loginSuccess(userData, data.token);
      
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

  const setAuth = async (auth: { token: string; email: string; name?: string; isAuthenticated: boolean }) => {
    try {
      // 서버에서 사용자 정보 가져오기
      const response = await fetch('http://localhost:8080/api/auth/me', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
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

      loginSuccess(userData, auth.token);
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      // 임시 사용자 정보로 대체
      const userData: User = {
        id: 0,
        user_name: auth.name || auth.email.split('@')[0],
        email: auth.email,
        email_verified: true,
        role: 'USER',
        created_at: new Date().toISOString()
      };
      loginSuccess(userData, auth.token);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    error,
    login,
    logout,
    signup,
    setAuth,
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