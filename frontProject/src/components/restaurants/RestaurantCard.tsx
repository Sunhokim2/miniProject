import { useState } from 'react';
import { Restaurant } from '@/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addBookmark, removeBookmark } from '@/services/restaurantService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PlaceIcon from '@mui/icons-material/Place';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

// 기본 음식 카테고리별 이미지 (임시 대응)
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

// 이미지 URL을 프록시 API로 변환하는 함수
const getProxiedImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return undefined;
  
  // URL이 http로 시작하는지 확인
  if (!imageUrl.startsWith('http')) {
    console.warn('유효하지 않은 이미지 URL:', imageUrl);
    return undefined;
  }

  try {
    // URL이 유효한지 확인 (잘못된 문자가 포함되어 있는지)
    new URL(imageUrl);
    return `http://localhost:8080/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;
  } catch (error) {
    console.error('URL 파싱 오류:', imageUrl, error);
    return undefined;
  }
};

// 이미지 URL을 Base64 API로 변환하는 함수
const getBase64ImageUrl = (originalUrl: string): string => {
  if (!originalUrl) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/api/image-to-base64?url=${encodeURIComponent(originalUrl)}`;
};

// 이미지 URL을 서버에서 직접 가져오는 함수
const getRestaurantImageUrl = (restaurantId: number | undefined): string => {
  if (!restaurantId) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/api/restaurants/${restaurantId}/image`;
};

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const queryClient = useQueryClient();

  // 북마크 추가 뮤테이션
  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 북마크 삭제 뮤테이션
  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 북마크 토글 핸들러
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    // restaurant.id 사용
    const restaurantId = restaurant.id;
    
    if (isBookmarked) {
      removeBookmarkMutation.mutate(restaurantId);
    } else {
      addBookmarkMutation.mutate(restaurantId);
    }
    
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-lg dark:bg-gray-800">
      <CardActionArea onClick={onClick} className="h-full">
        <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
          {/* 이미지 표시 (서버에서 직접 이미지 데이터 로드) */}
          {restaurant.id ? (
            <img 
              src={getRestaurantImageUrl(restaurant.id)}
              alt={restaurant.restaurant_name || restaurant.restaurantName || '레스토랑 이미지'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('이미지 로드 실패:', restaurant.id);
                (e.target as HTMLImageElement).src = getDefaultFoodImage(restaurant.category);
              }}
            />
          ) : (
            <img 
              src={getDefaultFoodImage(restaurant.category)}
              alt={restaurant.restaurant_name || restaurant.restaurantName || '레스토랑 이미지'} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2">
            <Chip 
              label={restaurant.category || '기타'} 
              size="small" 
              color="primary"
              icon={<RestaurantIcon style={{ color: 'white' }} />}
              className="bg-primary text-white"
            />
          </div>
        </div>
        
        <CardContent>
          <div className="flex justify-between items-start mb-2">
            <Typography variant="h6" component="h2" className="font-bold text-gray-900 dark:text-white">
              {restaurant.restaurant_name || restaurant.restaurantName || '이름 없음'}
            </Typography>
            <Rating value={restaurant.rate || 0} readOnly size="small" precision={0.5} />
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <PlaceIcon fontSize="small" className="mr-1" />
            <Typography variant="body2" noWrap>
              {restaurant.address || '주소 정보 없음'}
            </Typography>
          </div>
          
          {restaurant.mainMenu && restaurant.mainMenu.length > 0 && (
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400" noWrap>
              <span className="font-medium">대표 메뉴:</span> {restaurant.mainMenu.join(', ')}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      
      <CardActions className="flex justify-end">
        <IconButton 
          size="small" 
          onClick={handleToggleBookmark}
          color={isBookmarked ? "primary" : "default"}
          aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
        >
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RestaurantCard; 