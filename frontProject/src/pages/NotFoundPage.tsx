import { Link } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <SentimentVeryDissatisfiedIcon style={{ fontSize: 80 }} className="text-gray-400 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link to="/">
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          size="large"
        >
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage; 