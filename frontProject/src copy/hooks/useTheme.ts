import useThemeStore from '@/store/useThemeStore';
import { ThemeMode } from '@/types';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  // 테마 설정 함수
  const setTheme = (newTheme: ThemeMode) => {
    if (theme !== newTheme) {
      toggleTheme();
    }
  };

  return {
    theme,
    toggleTheme,
    setTheme,
    isDarkMode: theme === 'dark',
  };
}; 