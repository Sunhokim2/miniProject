import { useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { provider } = useParams();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (!token || !email) {
      console.error('Token or email not found');
      navigate('/login');
      return;
    }

    // 이미 인증된 상태라면 setAuth를 다시 호출하지 않음
    if (isAuthenticated && user && user.email === email) {
      navigate('/map');  // 메인 페이지로 리다이렉트
      return;
    }

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('token', token);

    // 인증 상태 업데이트
    setAuth({
      token,
      email,
      name: name || email.split('@')[0],
      isAuthenticated: true
    });

    // 메인 페이지로 리다이렉트
    navigate('/map');  // 메인 페이지로 리다이렉트
  }, [searchParams, navigate, setAuth, isAuthenticated, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">로그인 처리 중... ({provider})</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage; 