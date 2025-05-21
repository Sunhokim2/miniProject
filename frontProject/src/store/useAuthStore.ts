import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 시작
      loginStart: () => set({ isLoading: true, error: null }),
      
      // 로그인 성공
      loginSuccess: (user: User, token: string) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        }),
      
      // 로그인 실패
      loginFailure: (error: string) => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false, 
          error 
        }),
      
      // 로그아웃
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        }),
      
      // 사용자 정보 업데이트
      updateUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지 키 이름
      partialize: (state) => ({ user: state.user, token: state.token }), // 저장할 필드만 선택
    }
  )
);

export default useAuthStore; 