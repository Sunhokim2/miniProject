import { Link } from 'react-router-dom';
import logo from '@/assets/logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner dark:bg-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MATZIP" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              당신만의 맛집 지도를 만들어보세요.
            </p>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            <Link to="/map" className="text-gray-700 dark:text-gray-300 hover:text-primary">
              지도
            </Link>
            <Link to="/feed" className="text-gray-700 dark:text-gray-300 hover:text-primary">
              피드
            </Link>
            <Link to="/mypage" className="text-gray-700 dark:text-gray-300 hover:text-primary">
              마이페이지
            </Link>
            <Link to="/settings" className="text-gray-700 dark:text-gray-300 hover:text-primary">
              설정
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} MATZIP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 