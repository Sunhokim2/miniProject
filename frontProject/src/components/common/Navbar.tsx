import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import MapIcon from '@mui/icons-material/Map';
import FeedIcon from '@mui/icons-material/RssFeed';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '@/assets/logo.svg';

const Navbar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: '지도', path: '/map', icon: <MapIcon /> },
    { name: '피드', path: '/feed', icon: <FeedIcon /> },
    { name: '마이페이지', path: '/mypage', icon: <BookmarkIcon /> },
    { name: '설정', path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <>
      {/* 헤더 (모바일 & 데스크톱) */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MATZIP" className="h-8 w-auto" />
            </Link>

            {/* 데스크톱 네비게이션 메뉴 */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 ${
                    pathname === item.path
                      ? 'text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* 다크모드 토글 */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </button>

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
              >
                로그아웃
              </button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200"
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="py-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 ${
                      pathname === item.path
                        ? 'bg-gray-100 dark:bg-gray-700 text-primary font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    <span className="ml-2">{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 모바일 하단 탭 바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  pathname === item.path
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 데스크톱 푸터 */}
      <footer className="hidden lg:block bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 MATZIP. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                이용약관
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Navbar; 