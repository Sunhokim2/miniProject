import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Bookmark } from '@/mocks/users';
import { Restaurant } from '@/mocks/restaurants';
import { users, bookmarks } from '@/mocks/users';
import { restaurants } from '@/mocks/restaurants';
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

  // 더미데이터 사용
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve({ data: users }),
  });

  const { data: bookmarkData, isLoading: isBookmarkLoading, error: bookmarkError } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => Promise.resolve({ data: bookmarks }),
  });

  const { data: restaurantData, isLoading: isRestaurantLoading, error: restaurantError } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => Promise.resolve({ data: restaurants }),
  });

  // 로딩 상태와 에러 상태 계산
  const isLoading = isUserLoading || isBookmarkLoading || isRestaurantLoading;
  const error = userError || bookmarkError || restaurantError;

  // 데이터 로딩 상태 확인
  useEffect(() => {
    console.log('Current User:', user);
    console.log('User Data:', userData);
    console.log('Bookmark Data:', bookmarkData);
    console.log('Restaurant Data:', restaurantData);
  }, [user, userData, bookmarkData, restaurantData]);

  // 무한 스크롤 처리
  const lastRestaurantCallback = useCallback((node: HTMLDivElement | null) => {
    if (isRestaurantLoading || isBookmarkLoading) return;
    
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
  }, [isRestaurantLoading, isBookmarkLoading, hasNextPage]);

  // 데이터가 변경될 때 다음 페이지 여부 확인
  useEffect(() => {
    if (bookmarkData && restaurantData) {
      const bookmarkedRestaurants = restaurantData.data.filter(restaurant =>
        bookmarkData.data.some(bookmark => 
          bookmark.restaurant_id === restaurant.id && bookmark.user_id === user?.id
        )
      );
      setHasNextPage(page < Math.ceil(bookmarkedRestaurants.length / 10));
    }
  }, [bookmarkData, restaurantData, page, user?.id]);

  // 검색 처리
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
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

  // 북마크된 레스토랑 목록 렌더링
  const renderBookmarkedRestaurants = () => {
    if (!bookmarkData || !restaurantData) return null;

    const bookmarkedRestaurants = restaurantData.data.filter(restaurant =>
      bookmarkData.data.some(bookmark => 
        bookmark.restaurant_id === restaurant.id && bookmark.user_id === user?.id
      )
    );

    if (!bookmarkedRestaurants.length) {
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

    // 검색어 필터링
    let filteredRestaurants = bookmarkedRestaurants;
    if (searchKeyword) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.restaurant.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 정렬 적용
    filteredRestaurants = [...filteredRestaurants].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return b.id - a.id;
        case 'rating':
          return b.rate - a.rate;
        default:
          return 0;
      }
    });

    // 페이지네이션 적용
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    return (
      <Grid container spacing={3}>
        {paginatedRestaurants.map((restaurant, index) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <div ref={index === paginatedRestaurants.length - 1 ? lastRestaurantCallback : null}>
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

  if (isLoading) return <Box className="p-4">로딩 중...</Box>;
  if (error) return <Box className="p-4">에러가 발생했습니다.</Box>;
  if (!user) return <Box className="p-4">사용자 정보를 찾을 수 없습니다.</Box>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 프로필 섹션 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {user.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.user_name}</h2>
              <p className="text-gray-500">{user.email}</p>
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
                activeTab === 'bookmarks'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('bookmarks')}
            >
              저장한 맛집
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-medium mb-4">프로필 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <p className="mt-1">{user.user_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">가입일</label>
                  <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <Typography variant="h4" component="h1" className="font-bold text-gray-900 dark:text-white">
                  저장한 맛집
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
                    ]}
                  />
                </div>
              </div>
              
              {/* 에러 메시지 */}
              {(restaurantError || bookmarkError) && (
                <Alert severity="error" className="mb-4">
                  데이터를 불러오는데 실패했습니다.
                </Alert>
              )}
              
              {/* 북마크된 레스토랑 목록 */}
              {renderBookmarkedRestaurants()}
              
              {/* 로딩 인디케이터 */}
              {(isRestaurantLoading || isBookmarkLoading) && (
                <Box className="flex justify-center my-8">
                  <CircularProgress />
                </Box>
              )}
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