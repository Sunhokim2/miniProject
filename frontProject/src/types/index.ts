// 사용자 관련 타입
export interface User {
  id: number;
  user_name: string;
  email: string;
  email_verified: boolean;
  role: string;
  created_at: string;
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
  restaurantId?: number;  // 북마크에서 사용하는 원본 레스토랑 ID
  restaurant: string;
  category: string;
  region: string;
  main_menu: string[];
  address: string;
  body: string;
  latitude: number;
  longitude: number;
  rate: number;
  source: string;
  status: string;
  bookmarked?: boolean;
  imageUrl: string;
  description: string;
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