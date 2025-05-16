# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# frontProject

## 프로젝트 개요

React(Vite) 기반의 소셜 로그인 및 맛집 리뷰/예약 플랫폼 프론트엔드입니다.

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
