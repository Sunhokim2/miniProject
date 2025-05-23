# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# frontProject

## 프로젝트 개요

React(Vite) 기반의 소셜 로그인 및 맛집 리뷰/예약 플랫폼 프론트엔드입니다. 현존하는 레퍼런스페이지를 참고하여 제작하였습니다. 참고 레퍼런스 프로젝트:https://www.inflearn.com/course/%EB%A7%9B%EC%A7%91-%EC%A7%80%EB%8F%84%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-reactnative-nestjs
(맛집 지도앱 만들기 (React Native + NestJS))

## 기술 스택
- Frontend: React, TypeScript, Material-UI
- Backend: SpringBoot
- Database: PostgreSQL

## 개발 환경 설정

### 프론트엔드 설정
```bash
cd frontProject
npm install
npm run dev
```

### 백엔드 설정
```bash
cd backProject
npm install
npm run dev
```

## 더미데이터 구조

### 사용자 데이터 (users.ts)
```typescript
interface User {
  id: number;
  user_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  role: 'user' | 'admin';
  created_at: string;
}
```

### 레스토랑 데이터 (restaurants.ts)
```typescript
interface Restaurant {
  id: number;
  restaurant: string;
  address: string;
  latitude: number;
  longitude: number;
  rate: number;
  created_at: string;
}
```

### 북마크 데이터 (bookmarks.ts)
```typescript
interface Bookmark {
  id: number;
  user_id: number;
  restaurant_id: number;
  created_at: string;
}
```

### 게시물 데이터 (posts.ts)
```typescript
interface Post {
  id: number;
  restaurant_id: number;
  user_id: number;
  restaurant_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}
```

## 더미데이터 사용 방법
개발 환경에서는 `src/mocks` 디렉토리에 있는 더미데이터를 사용합니다. 각 데이터는 React Query를 통해 다음과 같이 사용됩니다:

```typescript
// 사용자 데이터 조회
const { data: userData } = useQuery({
  queryKey: ['users'],
  queryFn: () => Promise.resolve({ data: users }),
});

// 레스토랑 데이터 조회
const { data: restaurantData } = useQuery({
  queryKey: ['restaurants'],
  queryFn: () => Promise.resolve({ data: restaurants }),
});

// 북마크 데이터 조회
const { data: bookmarkData } = useQuery({
  queryKey: ['bookmarks'],
  queryFn: () => Promise.resolve({ data: bookmarks }),
});

// 게시물 데이터 조회
const { data: postData } = useQuery({
  queryKey: ['posts'],
  queryFn: () => Promise.resolve({ data: posts }),
});
```

## 페이지별 더미데이터 사용

### MapPage
- `restaurants.ts`: 기본 맛집 정보 표시
- `posts.ts`: 사용자 게시물 표시

### FeedPage
- `posts.ts`: 게시물 목록
- `restaurants.ts`: 연관된 맛집 정보
- `users.ts`: 게시물 작성자 정보

### MyPage
- `users.ts`: 사용자 정보
- `posts.ts`: 사용자의 게시물
- `bookmarks.ts`: 북마크한 맛집

### SettingsPage
- `users.ts`: 사용자 계정 정보

## API 연동
실제 서비스에서는 더미데이터 대신 백엔드 API를 사용합니다. API 연동 시에는 `src/services` 디렉토리의 API 클라이언트를 사용합니다.

## 라이선스
MIT

---

## 1. Docker로 개발환경 실행 및 사용법

### 1) Docker 이미지 빌드 및 컨테이너 실행

```bash
docker-compose build
docker-compose up
```

- 브라우저에서 [http://localhost:5173](http://localhost:5173) 접속
- 코드 수정 시 HMR(Hot Module Replacement)로 즉시 반영

### 2) 컨테이너 중지

```bash
docker-compose down
```

---

## 2. 주요 `.tsx` 파일별 기능 설명

- **src/pages/LoginPage.tsx** :
  - 카카오/구글/애플 소셜 로그인 버튼 및 로그인 폼 UI
- **src/pages/MyPage.tsx** :
  - 사용자 프로필, 즐겨찾기, 리뷰, 예약 등 마이페이지 탭 UI
- **src/pages/OAuthCallbackPage.tsx** :
  - 소셜 로그인 인증 후 콜백 처리 및 토큰 저장
- **src/pages/MainPage.tsx** :
  - 메인 지도(카카오맵) 및 맛집 리스트 표시
- **src/pages/RestaurantDetailPage.tsx** :
  - 맛집 상세정보, 메뉴, 리뷰, 즐겨찾기 기능
- **src/pages/ReviewPage.tsx** :
  - 리뷰 작성/수정/삭제, 별점, 사진 업로드
- **src/pages/SignupPage.tsx** :
  - 회원가입 폼
- **src/hooks/useAuth.ts** :
  - 인증 상태 관리, Mock 데이터 기반 개발 지원

---

## 3. 개발환경(Vite)에서 Nginx 배포환경으로 전환하는 방법

### 1) Vite로 정적 파일 빌드

```bash
npm run build
```
- `dist/` 폴더에 정적 파일 생성

### 2) Nginx Dockerfile 예시

```dockerfile
FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3) nginx.conf 예시

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4) Nginx 컨테이너 빌드 및 실행

```bash
docker build -t front-nginx .
docker run -d -p 80:80 front-nginx
```

---

## 4. 기타
- 환경변수는 `.env` 파일에서 관리
- 소셜 로그인 연동을 위해 각 서비스의 client id/secret 필요
- 개발 중 문의사항은 팀 슬랙 또는 이슈 트래커 활용

# .env 환경변수 파일은 깃에 연동되지 않으므로 프로젝트 루트 위치에 .env파일을 생성하고 아래 내용을 복사 붙여넣기 하세요.

# Kakao OAuth
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
VITE_KAKAO_REDIRECT_URI=http://localhost:5713/oauth/callback/kakao

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5713/oauth/callback/google

# Apple OAuth
VITE_APPLE_CLIENT_ID=your_apple_client_id
VITE_APPLE_REDIRECT_URI=http://localhost:5713/oauth/callback/apple 

# Naver OPEN API
VITE_NAVER_CLIENT_ID=your_naver_client_id

