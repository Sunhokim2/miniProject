import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '../utils/oauth';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const provider = window.location.pathname.split('/').pop() as 'kakao' | 'google' | 'apple';

      if (!code) {
        console.error('Authorization code not found');
        navigate('/login');
        return;
      }

      try {
        const data = await handleOAuthCallback(provider, code);
        // TODO: 토큰 저장 및 사용자 정보 처리
        navigate('/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage; 