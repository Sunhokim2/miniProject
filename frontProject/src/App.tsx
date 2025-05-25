import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, AuthProvider } from '@/hooks/useAuth';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

// Pages
import MapPage from '@/pages/MapPage';
import FeedPage from '@/pages/FeedPage';
import MyPage from '@/pages/MyPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import Search from './pages/Search';

import LoginLanding from '@/pages/LoginLanding';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 인증 상태 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">인증 정보 확인 중...</p>
      </div>
    );
  }

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

// 로그인 여부에 따라 리다이렉션 처리
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 인증 상태 확인이 끝났고, 이미 인증된 상태면 메인 페이지로 리다이렉트
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/map" replace />;
  }

  // 인증되지 않았거나 로딩 중이면 자식 컴포넌트 렌더링
  return <>{children}</>;
};

function App() {
  const { theme } = useTheme();
  
  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          } />
          <Route path="/login-landing" element={<LoginLanding />} />
          <Route path="/oauth/callback/:provider" element={<OAuthCallbackPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Search />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 