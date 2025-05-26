import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Rating, Chip, FormControl, 
  InputLabel, Select, MenuItem, TextField, InputAdornment, CircularProgress, Button, IconButton } from '@mui/material';
import { Restaurant } from '@/types';
import { getRestaurants } from '@/services/restaurantService';
import { addBookmark, removeBookmark } from '@/services/restaurantService';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// 카테고리별 기본 이미지
const DEFAULT_FOOD_IMAGES: Record<string, string> = {
  '한식': 'https://cdn.pixabay.com/photo/2019/06/04/11/54/korean-food-4251686_1280.jpg',
  '중식': 'https://cdn.pixabay.com/photo/2018/12/03/01/04/spicy-and-sour-noodles-3852590_1280.jpg',
  '일식': 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_1280.jpg',
  '양식': 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  '치킨': 'https://cdn.pixabay.com/photo/2014/01/24/04/05/fried-chicken-250863_1280.jpg',
  '분식': 'https://cdn.pixabay.com/photo/2019/06/10/10/43/tteokbokki-4264558_1280.jpg',
  '카페': 'https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg',
  'default': 'https://cdn.pixabay.com/photo/2017/06/01/18/46/cook-2364221_1280.jpg'
};

// 카테고리에 맞는 기본 이미지 가져오기
const getDefaultFoodImage = (category: string | undefined): string => {
  if (!category) return DEFAULT_FOOD_IMAGES['default'];
  
  for (const key of Object.keys(DEFAULT_FOOD_IMAGES)) {
    if (category.includes(key)) {
      return DEFAULT_FOOD_IMAGES[key];
    }
  }
  
  return DEFAULT_FOOD_IMAGES['default'];
};

// 이미지 URL 프록시 함수
const getRestaurantImageUrl = (restaurantId: number | undefined): string => {
  if (!restaurantId) return '';
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/restaurants/${restaurantId}/image`;
};

const FeedPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // latest, oldest, visited_recent, visited_old, nearest
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const queryClient = useQueryClient();

  // Get current location
  useEffect(() => {
    if (sortBy === 'nearest' && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Failed to get current location:', error);
          alert('Failed to get current location. Please check location permissions.');
          // Change to default sort if couldn't get location
          setSortBy('latest');
        }
      );
    }
  }, [sortBy, currentLocation]);

  // Infinite query for restaurants data with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['restaurants', sortBy, category, searchTerm, currentLocation],
    queryFn: async ({ pageParam = 1 }) => {
      // Parameters for sorting and filtering
      const params: any = {
        page: pageParam,
        limit: 12,
        search: searchTerm || undefined,
        category: category || undefined,
      };

      // Setting sort parameters based on selected sort option
      switch (sortBy) {
        case 'latest':
          params.sortBy = 'created_at:desc';
          break;
        case 'oldest':
          params.sortBy = 'created_at:asc';
          break;
        case 'visited_recent':
          params.sortBy = 'visited_at:desc';
          break;
        case 'visited_old':
          params.sortBy = 'visited_at:asc';
          break;
        case 'nearest':
          if (currentLocation) {
            params.latitude = currentLocation.latitude;
            params.longitude = currentLocation.longitude;
            params.sortBy = 'distance:asc';
          } else {
            params.sortBy = 'created_at:desc';
          }
          break;
      }

      const response = await getRestaurants(params);
      return response;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: sortBy !== 'nearest' || !!currentLocation || sortBy === 'nearest'
  });

  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // Remove bookmark mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // Bookmark toggle handler
  const handleToggleBookmark = (restaurant: Restaurant, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening detail modal
    
    // Using 'as any' to work around type issues with bookmarked property
    const isBookmarked = (restaurant as any).bookmarked;
    
    if (isBookmarked) {
      removeBookmarkMutation.mutate(restaurant.id);
    } else {
      addBookmarkMutation.mutate(restaurant.id);
    }
  };

  // 무한 스크롤 구현을 위한 마지막 아이템 ref 콜백
  const lastRestaurantElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  // 레스토랑 선택 핸들러
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  // Create restaurant list from pages
  const restaurants = data?.pages.flatMap(page => (page as any).data) || [];

  // 현재 위치까지의 거리 계산 함수
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // 소수점 한 자리까지 표시
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  // 정렬 방식 변경 핸들러
  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  // 현재 위치로 정렬 핸들러
  const handleSortByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setSortBy('nearest');
        },
        (error) => {
          console.error('현재 위치를 가져오는데 실패했습니다:', error);
          alert('현재 위치를 가져오는데 실패했습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
    }
  };

  // Card component - fix bookmarked and created_at properties
  const renderRestaurantCard = (restaurant: Restaurant, isLastItem: boolean, ref: React.Ref<HTMLDivElement>) => {
    // Cast to any to access potentially missing properties
    const restaurantData = restaurant as any;
    
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id} ref={ref}>
        <Card 
          className="h-full flex flex-col cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleSelectRestaurant(restaurant)}
        >
          <Box className="relative">
            <CardMedia
              component="img"
              height="160"
              image={restaurant.imageUrl || getRestaurantImageUrl(restaurant.id) || getDefaultFoodImage(restaurant.category)}
              alt={restaurant.restaurant_name}
              className="h-40 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultFoodImage(restaurant.category);
              }}
            />
            <IconButton
              className={`absolute top-2 right-2 ${
                restaurantData.bookmarked
                  ? 'text-yellow-500 bg-white bg-opacity-70'
                  : 'bg-black bg-opacity-30 text-white'
              } hover:bg-white hover:text-yellow-500 hover:bg-opacity-70`}
              onClick={(e) => handleToggleBookmark(restaurant, e)}
              size="small"
            >
              {restaurantData.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
          <CardContent className="flex-1 flex flex-col">
            <Box className="flex justify-between items-start mb-1">
              <Typography variant="h6" component="h2" className="font-bold line-clamp-1">
                {restaurant.restaurant_name}
              </Typography>
              <Rating value={restaurant.rate || 0} readOnly precision={0.5} size="small" />
            </Box>
            
            <Box className="flex gap-1 flex-wrap mb-2">
              {restaurant.category && (
                <Chip 
                  label={restaurant.category} 
                  size="small" 
                  className="bg-primary text-white" 
                  icon={<RestaurantIcon className="text-white" />}
                />
              )}
              
              {restaurantData.created_at && (
                <Chip 
                  label={new Date(restaurantData.created_at).toLocaleDateString()} 
                  size="small" 
                  variant="outlined"
                  icon={<EventIcon />}
                />
              )}
            </Box>
            
            {currentLocation && restaurant.latitude && restaurant.longitude && sortBy === 'nearest' && (
              <Typography variant="body2" className="text-gray-600 mt-auto flex items-center">
                <LocationOnIcon fontSize="small" className="mr-1" />
                {calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  parseFloat(restaurant.latitude.toString()),
                  parseFloat(restaurant.longitude.toString())
                )}km
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box className="p-4 max-w-7xl mx-auto">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        맛집 피드
      </Typography>

      {/* 검색 및 필터링 */}
      <Box className="flex flex-col md:flex-row gap-4 mb-6">
        <TextField
          label="검색"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" className="min-w-[150px]">
          <InputLabel>카테고리</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="카테고리"
            startAdornment={<RestaurantIcon className="mr-2" />}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="한식">한식</MenuItem>
            <MenuItem value="중식">중식</MenuItem>
            <MenuItem value="일식">일식</MenuItem>
            <MenuItem value="양식">양식</MenuItem>
            <MenuItem value="카페">카페</MenuItem>
            <MenuItem value="분식">분식</MenuItem>
            <MenuItem value="기타">기타</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="min-w-[180px]">
          <InputLabel>정렬</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="정렬"
            startAdornment={<SortIcon className="mr-2" />}
          >
            <MenuItem value="latest">최신순</MenuItem>
            <MenuItem value="oldest">오래된순</MenuItem>
            <MenuItem value="visited_recent">최근 방문순</MenuItem>
            <MenuItem value="visited_old">오래된 방문순</MenuItem>
            <MenuItem value="nearest">가까운 순</MenuItem>
          </Select>
        </FormControl>

        {sortBy === 'nearest' && (
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<MyLocationIcon />}
            onClick={handleSortByLocation}
          >
            내 위치 갱신
          </Button>
        )}
      </Box>

      {/* 로딩 상태 */}
      {isLoading && (
        <Box className="flex justify-center items-center py-10">
          <CircularProgress />
        </Box>
      )}

      {/* 에러 상태 */}
      {error && (
        <Box className="text-center py-10">
          <Typography color="error">
            데이터를 불러오는데 실패했습니다. 다시 시도해주세요.
          </Typography>
        </Box>
      )}

      {/* 결과 없음 */}
      {!isLoading && restaurants.length === 0 && (
        <Box className="text-center py-10">
          <Typography variant="h6" className="mb-4">
            {searchTerm ? '검색 결과가 없습니다.' : '저장된 맛집이 없습니다.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/map"
          >
            맛집 탐색하기
          </Button>
        </Box>
      )}

      {/* 레스토랑 그리드 */}
      <Grid container spacing={3}>
        {restaurants.map((restaurant, index) => {
          // 마지막 아이템에 ref 추가
          const isLastItem = index === restaurants.length - 1;
          
          return renderRestaurantCard(restaurant, isLastItem, isLastItem ? lastRestaurantElementRef : null);
        })}
      </Grid>

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && (
        <Box className="flex justify-center my-6">
          <CircularProgress size={30} />
        </Box>
      )}

      {/* 레스토랑 상세 모달 */}
      {showDetailModal && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </Box>
  );
};

export default FeedPage;
