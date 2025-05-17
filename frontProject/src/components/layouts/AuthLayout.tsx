import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.svg';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex justify-center">
            <img src={logo} alt="MATZIP" className="h-24 w-auto" />
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            <Outlet />
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 