import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, ThemeState } from '@/types';

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as ThemeMode,
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),
    }),
    {
      name: 'theme-storage', // 로컬 스토리지 키 이름
    }
  )
);

export default useThemeStore; 