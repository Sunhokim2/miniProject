import React, { useState } from 'react';
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
    <div className="login-container">
      <div className="login-box">
        <h2>이집맛집 Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your E-Mail"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 