import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  user_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, user_name: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock 데이터
const mockUser: User = {
  id: 1,
  user_name: '테스트 사용자',
  email: 'test@example.com',
  password: 'hashed_password',
  email_verified: true,
  role: 'USER',
  created_at: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock 데이터 사용 여부를 환경 변수로 제어
    if (import.meta.env.VITE_USE_MOCK_DATA) {
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock 데이터 사용 여부를 환경 변수로 제어
      if (import.meta.env.VITE_USE_MOCK_DATA) {
        console.log('Mock 데이터 사용: Mockup 사용자로 로그인');
        setUser(mockUser);
        return;
      }
      
      // TODO: 실제 API 호출로 대체
      throw new Error('API가 구현되지 않았습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: 실제 API 호출로 대체
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, user_name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: 실제 API 호출로 대체
      if (import.meta.env.VITE_USE_MOCK_DATA) {
        setUser(mockUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
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