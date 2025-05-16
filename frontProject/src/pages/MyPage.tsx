import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/types';
import { getBookmarkedRestaurants } from '@/services/bookmarkService';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import SearchInput from '@/components/common/SearchInput';
import SortSelect from '@/components/common/SortSelect';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/hooks/useAuth';

const MyPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRestaurantRef = useRef<HTMLDivElement | null>(null);

  // 북마크된 레스토랑 데이터 조회
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['bookmarked-restaurants', { page, searchKeyword, sortBy }],
    queryFn: () => getBookmarkedRestaurants({ 
      page, 
      limit: 10,
      sortBy,
    }),
    keepPreviousData: true,
  });

  // 무한 스크롤 처리
  const lastRestaurantCallback = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        setPage((prev) => prev + 1);
      }
    });
    
    if (node) {
      lastRestaurantRef.current = node;
      observerRef.current.observe(node);
    }
  }, [isFetching, hasNextPage]);

  // 데이터가 변경될 때 다음 페이지 여부 확인
  useEffect(() => {
    if (data) {
      setHasNextPage(data.page < data.totalPages);
    }
  }, [data]);

  // 검색 처리
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1); // 페이지 초기화
  };

  // 정렬 변경
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  // 레스토랑 클릭 처리
  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  // 레스토랑 카드 렌더링
  const renderRestaurantCards = () => {
    if (!data || !data.data.length) {
      return (
        <Box className="py-16 text-center">
          <BookmarkIcon className="text-gray-400 text-5xl mb-4" />
          <Typography variant="h6" className="text-gray-600 dark:text-gray-400 mb-6">
            {searchKeyword 
              ? '검색 결과가 없습니다.'
              : '저장된 맛집이 없습니다.'}
          </Typography>
          {!searchKeyword && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              href="/map"
            >
              맛집 저장하러 가기
            </Button>
          )}
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {data.data.map((restaurant, index) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <div ref={index === data.data.length - 1 ? lastRestaurantCallback : null}>
              <RestaurantCard
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            </div>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 프로필 섹션 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500">👤</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.nickname || '사용자'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white shadow rounded-lg mb-6">
          <nav className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              프로필
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              찜한 식당
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              내 리뷰
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'reservations'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reservations')}
            >
              예약 내역
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-medium mb-4">프로필 정보</h3>
              {/* 프로필 정보 수정 폼 */}
            </div>
          )}
          {activeTab === 'favorites' && (
            <div>
              <h3 className="text-lg font-medium mb-4">찜한 식당</h3>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <Typography variant="h4" component="h1" className="font-bold text-gray-900 dark:text-white">
                  내 맛집 목록
                </Typography>
                
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <SearchInput
                    placeholder="맛집 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onSearch={handleSearch}
                    className="flex-grow md:w-64"
                  />
                  
                  <SortSelect
                    value={sortBy}
                    onChange={handleSortChange}
                    options={[
                      { value: 'latest', label: '최신순' },
                      { value: 'rating', label: '평점순' },
                      { value: 'distance', label: '거리순' },
                    ]}
                  />
                </div>
              </div>
              
              {/* 에러 메시지 */}
              {error && (
                <Alert severity="error" className="mb-4">
                  데이터를 불러오는데 실패했습니다.
                </Alert>
              )}
              
              {/* 레스토랑 목록 */}
              {renderRestaurantCards()}
              
              {/* 로딩 인디케이터 */}
              {(isLoading || isFetching) && (
                <Box className="flex justify-center my-8">
                  <CircularProgress />
                </Box>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium mb-4">내 리뷰</h3>
              {/* 리뷰 목록 */}
            </div>
          )}
          {activeTab === 'reservations' && (
            <div>
              <h3 className="text-lg font-medium mb-4">예약 내역</h3>
              {/* 예약 내역 목록 */}
            </div>
          )}
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {showDetailModal && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default MyPage; 