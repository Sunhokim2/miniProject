import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Restaurant, MapCoordinates } from '@/types';
import { createRestaurant, updateRestaurant } from '@/services/restaurantService';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';

interface AddRestaurantModalProps {
  onClose: () => void;
  onAdd: (restaurant: Restaurant) => void;
  initialLocation?: MapCoordinates;
  editRestaurant?: Restaurant; // 수정 시 전달되는 레스토랑 정보
}

const CATEGORIES = [
  '한식', '중식', '일식', '양식', '카페', '분식', '패스트푸드', '기타'
];

const AddRestaurantModal = ({ 
  onClose, 
  onAdd, 
  initialLocation,
  editRestaurant 
}: AddRestaurantModalProps) => {
  const isEditMode = !!editRestaurant;
  
  // 상태 초기화
  const [name, setName] = useState(editRestaurant?.restaurant || '');
  const [category, setCategory] = useState(editRestaurant?.category || '');
  const [address, setAddress] = useState(editRestaurant?.address || '');
  const [mainMenu, setMainMenu] = useState(editRestaurant?.main_menu || '');
  const [body, setBody] = useState(editRestaurant?.body || '');
  const [rating, setRating] = useState<number>(editRestaurant?.rate || 0);
  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [coordinates, setCoordinates] = useState<MapCoordinates>(
    editRestaurant 
      ? { latitude: editRestaurant.latitude, longitude: editRestaurant.longitude }
      : initialLocation || { latitude: 0, longitude: 0 }
  );
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // 맛집 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      if (data.data) {
        onAdd(data.data);
      }
    },
    onError: (error: any) => {
      setError(error.message || '맛집 추가에 실패했습니다.');
    }
  });

  // 맛집 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Restaurant> }) => 
      updateRestaurant(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      if (data.data) {
        onAdd(data.data);
      }
    },
    onError: (error: any) => {
      setError(error.message || '맛집 수정에 실패했습니다.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !address) {
      setError('맛집 이름, 카테고리, 주소는 필수 입력 항목입니다.');
      return;
    }

    const restaurantData: Partial<Restaurant> = {
      restaurant: name,
      category,
      address,
      main_menu: mainMenu,
      body,
      rate: rating,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    if (isEditMode && editRestaurant) {
      updateMutation.mutate({ 
        id: editRestaurant.id, 
        data: restaurantData 
      });
    } else {
      createMutation.mutate(restaurantData);
    }
  };

  // 주소 검색
  const handleSearchAddress = () => {
    // TODO: 네이버/카카오 주소 검색 API 연동
    alert('주소 검색 기능은 아직 구현되지 않았습니다.');
  };

  // 로딩 중인지 여부
  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="add-restaurant-modal"
      className="flex items-center justify-center p-4"
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Typography variant="h6" className="font-bold">
            {isEditMode ? '맛집 정보 수정' : '새로운 맛집 추가'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        {error && (
          <Alert severity="error" className="m-4" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <TextField
            label="맛집 이름"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />

          <FormControl fullWidth required>
            <InputLabel>카테고리</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="카테고리"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex space-x-2">
            <TextField
              label="주소"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button 
              variant="outlined" 
              onClick={handleSearchAddress}
              disabled={isLoading}
            >
              <SearchIcon fontSize="small" />
            </Button>
          </div>

          <TextField
            label="대표 메뉴"
            fullWidth
            value={mainMenu}
            onChange={(e) => setMainMenu(e.target.value)}
            disabled={isLoading}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <DatePicker
              label="방문 날짜"
              value={visitDate}
              onChange={(newValue) => setVisitDate(newValue)}
              slotProps={{ textField: { fullWidth: true, disabled: isLoading } }}
            />
          </LocalizationProvider>

          <div>
            <Typography component="legend">평점</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue || 0);
              }}
              precision={0.5}
              disabled={isLoading}
            />
          </div>

          <TextField
            label="메모"
            multiline
            rows={4}
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outlined" 
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
            >
              {isEditMode ? '수정하기' : '추가하기'}
            </LoadingButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddRestaurantModal; 