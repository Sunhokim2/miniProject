import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/mocks/restaurants';
import { Post } from '@/mocks/posts';
import { restaurants } from '@/mocks/restaurants';
import { posts } from '@/mocks/posts';
import MapControls from '@/components/map/MapControls';
import RestaurantMarker from '@/components/map/RestaurantMarker';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import AddRestaurantModal from '@/components/restaurants/AddRestaurantModal';
import SearchBar from '@/components/map/SearchBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

declare global {
  interface Window {
    naver: any;
  }
}

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    latitude: 37.5665, // 서울 중심 좌표
    longitude: 126.9780,
  });

  // 더미데이터 사용
  const { data: restaurantData, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => Promise.resolve({ data: restaurants }),
  });

  const { data: postData } = useQuery({
    queryKey: ['posts'],
    queryFn: () => Promise.resolve({ data: posts }),
  });

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
      zoom: 14,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    naverMapRef.current = map;

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = new window.naver.maps.LatLng(latitude, longitude);
          map.setCenter(newCenter);
          setMapCenter({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting current position:', error);
        }
      );
    }

    return () => {
      if (naverMapRef.current) {
        naverMapRef.current = null;
      }
    };
  }, []);

  // 마커 표시하기
  useEffect(() => {
    if (!naverMapRef.current || !restaurantData?.data) return;

    const markers: any[] = [];

    restaurantData.data.forEach((restaurant) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(restaurant.latitude, restaurant.longitude),
        map: naverMapRef.current,
        title: restaurant.restaurant,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        handleSelectRestaurant(restaurant);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [restaurantData]);

  // 레스토랑 선택 핸들러
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  // 내 위치로 이동 핸들러
  const handleMoveToMyLocation = () => {
    if (!naverMapRef.current || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = new window.naver.maps.LatLng(latitude, longitude);
        naverMapRef.current.setCenter(newCenter);
        setMapCenter({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting current position:', error);
      }
    );
  };

  // 맛집 추가 모달 열기
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  // 맛집 추가 후 처리
  const handleAddRestaurant = (newRestaurant: Restaurant) => {
    setShowAddModal(false);
    // TODO: React Query invalidation 로직
  };

  return (
    <div className="relative h-screen w-full">
      {/* 지도 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress />
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" className="absolute top-4 left-1/2 transform -translate-x-1/2">
          데이터를 불러오는데 실패했습니다.
        </Alert>
      )}

      {/* 검색 바 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <SearchBar 
          onSearch={(keyword) => {
            // TODO: 검색 로직 구현
            console.log('Search:', keyword);
          }} 
        />
      </div>

      {/* 지도 컨트롤 */}
      <div className="absolute top-20 right-4">
        <MapControls onMyLocation={handleMoveToMyLocation} />
      </div>

      {/* 맛집 추가 버튼 */}
      <div className="absolute bottom-8 right-8">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenAddModal}
        >
          <AddIcon />
        </Fab>
      </div>

      {/* 맛집 상세 정보 모달 */}
      {showDetailModal && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* 맛집 추가 모달 */}
      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRestaurant}
          initialLocation={mapCenter}
        />
      )}
    </div>
  );
};

export default MapPage; 