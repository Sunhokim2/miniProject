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
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold text-primary">
            MATZIP
          </Link>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* 데스크톱 메뉴 */}
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
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  pathname === item.path
                    ? 'bg-gray-100 dark:bg-gray-700 text-primary font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar; 