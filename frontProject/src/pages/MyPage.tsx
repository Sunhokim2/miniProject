import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import regionColors from './korea_regions_colors.json';
import categoryColors from './category_colors.json';

interface RegionColor {
  region: string;
  color: string;
}

interface CategoryColor {
  [key: string]: string;
}

interface Restaurant {
  id: number;
  restaurant: string;
  category: string;
  region: string;
  rate: number;
  image: string;
  imageUrl: string;
  description: string;
  main_menu: string[];
  address: string;
  body: string;
  latitude: number;
  longitude: number;
  source: string;
  status: string;
}

const MyPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectCategory, setSelectedCategory] = useState("전체");
  const [selectRegion, setSelectedRegion] = useState("전체");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRestaurantRef = useRef<HTMLDivElement | null>(null);

  const regionColorsMap = (regionColors as RegionColor[]).reduce((acc, curr) => {
    acc[curr.region] = curr.color;
    return acc;
  }, {} as { [key: string]: string });

  const categoryList = ["전체", ...Object.keys(categoryColors as CategoryColor)];
  const regionList = ["전체", ...Object.keys(regionColorsMap)];

  // 북마크된 레스토랑 데이터 가져오기
  const { data: bookmarkData, isLoading: isBookmarkLoading, error: bookmarkError } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      console.log('북마크 데이터 요청 시작');
      const token = localStorage.getItem('token');
      console.log('사용할 토큰:', token);
      
      if (!token) throw new Error('인증 토큰이 없습니다.');
      
      const response = await fetch('http://localhost:8080/api/bookmarks/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('북마크 데이터 응답:', response);
      
      if (!response.ok) throw new Error('북마크 데이터를 가져오는데 실패했습니다.');
      
      const data = await response.json();
      console.log('북마크 데이터:', data);

      // 백엔드에서 온 데이터 형식에 맞게 변환 (restaurant 객체가 중첩되어 있음)
      return data.map((bookmark: any) => ({
        id: bookmark.id,
        restaurant: bookmark.restaurant.name,  // 레스토랑 이름
        category: bookmark.restaurant.category,
        region: bookmark.restaurant.region,
        rate: bookmark.restaurant.rate,
        address: bookmark.restaurant.address,
        imageUrl: bookmark.restaurant.imageUrl,
        restaurantId: bookmark.restaurant.id,  // 원래 레스토랑 ID를 별도로 저장
        createdAt: bookmark.createdAt
      }));
    },
    enabled: !!localStorage.getItem('token')
  });

  // 데이터 로딩 상태 확인
  useEffect(() => {
    console.log('마이페이지 접근 - 현재 사용자 정보:', user);
    console.log('마이페이지 접근 - 북마크 데이터:', bookmarkData);
    console.log('마이페이지 접근 - 북마크 로딩 상태:', isBookmarkLoading);
    console.log('마이페이지 접근 - 북마크 에러:', bookmarkError);
  }, [user, bookmarkData, isBookmarkLoading, bookmarkError]);

  // 데이터가 변경될 때 다음 페이지 여부 확인
  useEffect(() => {
    if (bookmarkData) {
      setHasNextPage(page < Math.ceil(bookmarkData.length / 10));
    }
  }, [bookmarkData, page]);

  // 무한 스크롤 처리
  const lastRestaurantCallback = useCallback((node: HTMLDivElement | null) => {
    if (isBookmarkLoading) return;
    
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
  }, [isBookmarkLoading, hasNextPage]);

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
    if (!bookmarkData) return null;

    let bookmarkedRestaurants = [...bookmarkData];

    // 카테고리 필터링
    if (selectCategory !== "전체") {
      bookmarkedRestaurants = bookmarkedRestaurants.filter(
        restaurant => restaurant.category === selectCategory
      );
    }

    // 지역 필터링
    if (selectRegion !== "전체") {
      bookmarkedRestaurants = bookmarkedRestaurants.filter(
        restaurant => restaurant.region === selectRegion
      );
    }

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
    if (searchKeyword) {
      bookmarkedRestaurants = bookmarkedRestaurants.filter(restaurant =>
        restaurant.restaurant.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 정렬 적용
    bookmarkedRestaurants = [...bookmarkedRestaurants].sort((a, b) => {
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
    const paginatedRestaurants = bookmarkedRestaurants.slice(startIndex, endIndex);

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

  if (isBookmarkLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (bookmarkError) {
    return (
      <Alert severity="error" className="m-4">
        {bookmarkError instanceof Error ? bookmarkError.message : '데이터를 불러오는데 실패했습니다.'}
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'profile' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('profile')}
          >
            프로필
          </Button>
          <Button
            variant={activeTab === 'bookmarks' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('bookmarks')}
          >
            북마크
          </Button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <Box className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Typography variant="h6" className="mb-4">
            사용자 정보
          </Typography>
          <Typography>
            이메일: {user?.email}
          </Typography>
          <Typography>
            이름: {user?.user_name}
          </Typography>
        </Box>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <SearchInput 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch} 
            />
            <SortSelect 
              value={sortBy} 
              onChange={handleSortChange}
              options={[
                { value: 'latest', label: '최신순' },
                { value: 'rating', label: '평점순' }
              ]}
            />
          </div>
          {renderBookmarkedRestaurants()}
        </div>
      )}

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