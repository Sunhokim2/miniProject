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

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(restaurant.bookmarked || false);
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
    
    // restaurant.id 또는 restaurant.restaurantId 중 존재하는 값을 사용
    const restaurantId = restaurant.restaurantId || restaurant.id;
    
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
          {/* 여기에 이미지가 있다면 표시 */}
          <div className="absolute top-2 right-2">
            <Chip 
              label={restaurant.category} 
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
              {restaurant.restaurant}
            </Typography>
            <Rating value={restaurant.rate} readOnly size="small" precision={0.5} />
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <PlaceIcon fontSize="small" className="mr-1" />
            <Typography variant="body2" noWrap>
              {restaurant.address}
            </Typography>
          </div>
          
          {restaurant.main_menu && (
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400" noWrap>
              <span className="font-medium">대표 메뉴:</span> {restaurant.main_menu}
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