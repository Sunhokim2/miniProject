import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '@/services/restaurantService';
import { Restaurant } from '@/types';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import SearchInput from '@/components/common/SearchInput';
import SortSelect from '@/components/common/SortSelect';
import FilterChips from '@/components/common/FilterChips';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';

const FeedPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRestaurantRef = useRef<HTMLDivElement | null>(null);

  // 레스토랑 데이터 조회
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['restaurants', { page, searchKeyword, sortBy, filters }],
    queryFn: () => getRestaurants({ 
      page, 
      search: searchKeyword,
      limit: 10,
      sortBy,
      // 기타 필터 파라미터
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

  // 필터 토글
  const handleFilterToggle = (filter: string) => {
    setFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
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
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {searchKeyword 
              ? '검색 결과가 없습니다.'
              : '등록된 맛집이 없습니다.'}
          </Typography>
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Typography variant="h4" component="h1" className="font-bold text-gray-900 dark:text-white">
          맛집 피드
        </Typography>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <SearchInput
            placeholder="맛집 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            className="flex-grow md:w-64"
          />
          
          <IconButton className="bg-gray-100 dark:bg-gray-700">
            <FilterListIcon />
          </IconButton>
          
          <IconButton className="bg-gray-100 dark:bg-gray-700">
            <TuneIcon />
          </IconButton>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SortSelect
          value={sortBy}
          onChange={handleSortChange}
          options={[
            { value: 'latest', label: '최신순' },
            { value: 'rating', label: '평점순' },
            { value: 'distance', label: '거리순' },
          ]}
        />
        
        <FilterChips
          filters={[
            { id: 'korean', label: '한식' },
            { id: 'chinese', label: '중식' },
            { id: 'japanese', label: '일식' },
            { id: 'western', label: '양식' },
            { id: 'cafe', label: '카페' },
          ]}
          selectedFilters={filters}
          onToggle={handleFilterToggle}
        />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
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

export default FeedPage; 