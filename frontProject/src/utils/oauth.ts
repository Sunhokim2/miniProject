// OAuth 관련 타입 정의
interface OAuthConfig {
  clientId: string;
  redirectUri: string;
}

// OAuth 설정
const oauthConfig: Record<string, OAuthConfig> = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/oauth/callback/google',
  },
  kakao: {
    clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173/oauth/callback/kakao',
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_APPLE_REDIRECT_URI || 'http://localhost:5173/oauth/callback/apple',
  },
};

// 구글 로그인 URL 생성
export const getGoogleLoginUrl = () => {
  return "http://localhost:8080/oauth2/authorization/google";
};

// 카카오 로그인 URL 생성
export const getKakaoLoginUrl = () => {
  return "http://localhost:8080/oauth2/authorization/kakao";
};

// 애플 로그인 URL 생성
export const getAppleLoginUrl = () => {
  return "http://localhost:8080/oauth2/authorization/apple";
};

// OAuth 콜백 처리
export const handleOAuthCallback = async (provider: 'kakao' | 'google' | 'apple', code: string) => {
  try {
    const response = await fetch(`/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('OAuth 인증 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${provider} OAuth 처리 중 오류 발생:`, error);
    throw error;
  }
}; 