// 사용자 관련 타입
export interface User {
  id: number;
  user_name: string;
  email: string;
  email_verified: boolean;
  role: string;
  created_at: string;
  picture?: string; // 구글 프로필 이미지 URL
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginStart: () => void;
  loginSuccess: (user: User, token: string) => void;
  loginFailure: (error: string) => void;
  logout: () => void;
}

// 레스토랑 관련 타입
export interface Restaurant {
  id: number;
  restaurant_name: string;
  restaurantName?: string; // API 응답에서 사용되는 필드명
  address: string;
  category: string;
  region: string;
  mainMenu: string[];
  body: string;
  rate: number;
  latitude: string;
  longitude: string;
  status: boolean;
  source: string;
  imageUrl: string | null;
  imageBase64?: string; // Base64 인코딩된 이미지 데이터
  imageType?: string;   // 이미지 타입 (예: image/jpeg)
}

// 포스트 관련 타입
export interface Post {
  id: number;
  restaurant_id: number;
  user_id: number;
  restaurant_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
  restaurant?: Restaurant;
}

// 북마크 관련 타입
export interface Bookmark {
  id: number;
  user_id: number;
  restaurant_id: number;
  restaurant?: Restaurant;
}

// 지도 관련 타입
export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

// 테마 관련 타입
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 