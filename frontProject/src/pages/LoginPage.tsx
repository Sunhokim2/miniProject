import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { KakaoIcon, AppleIcon } from '@/components/common/SocialIcons';
import { getKakaoLoginUrl, getGoogleLoginUrl, getAppleLoginUrl } from '../utils/oauth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    try {
      await login(email, password);
      console.log('로그인 성공, 홈으로 이동');
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (err) {
      console.error('로그인 실패:', err);
      setShowError(true);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  const handleAppleLogin = () => {
    window.location.href = getAppleLoginUrl();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">로그인</h1>
      
      {showError && error && (
        <Alert 
          severity="error" 
          className="mb-4"
          onClose={() => setShowError(false)}
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <TextField
            fullWidth
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: <EmailIcon className="mr-2 text-gray-500" />,
            }}
          />
        </div>
        
        <div>
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: <LockIcon className="mr-2 text-gray-500" />,
            }}
          />
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            className="py-3"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>
        </div>
      </form>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              또는
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full flex flex-col items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#391B1B] bg-[#FEE500] hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
          >
            <svg className="h-8 w-8 mb-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C6.5 3 2 6.30769 2 10.4615C2 13.0769 3.75 15.3846 6.5 16.6154L5.5 20.5385C5.5 20.7692 5.625 21 5.875 21C6 21 6.125 20.8846 6.25 20.7692L10.75 17.7692C11.125 17.7692 11.625 17.7692 12 17.7692C17.5 17.7692 22 14.4615 22 10.4615C22 6.30769 17.5 3 12 3Z"></path>
            </svg>
            <span className="text-xs whitespace-pre-line text-center">카카오 로그인</span>
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex flex-col items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#4285F4] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
          >
            <svg className="h-8 w-8 mb-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-xs whitespace-pre-line text-center">구글 로그인</span>
          </button>
          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-full flex flex-col items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <svg className="h-8 w-8 mb-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.36-1.09-.45-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.37 3.51 7.08 9.05 6.74c1.79.05 3.07 1.2 4.07 1.23 1.55-.15 3.05-1.35 4.74-1.1 1.2.13 2.26.63 3.01 1.55-3.35 2.07-2.81 6.68.17 8.32-1.03 2.4-2.33 4.72-3.99 6.54ZM12.03 6.5C11.88 4.24 13.74 2.31 15.76 2c.41 2.54-2.34 5.13-3.73 4.5Z"></path>
            </svg>
            <span className="text-xs whitespace-pre-line text-center">애플 로그인</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/signup" className="text-primary hover:text-primary-dark">
          계정이 없으신가요? 회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage; 