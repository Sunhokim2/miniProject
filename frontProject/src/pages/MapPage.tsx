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
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null);

  // 더미데이터 사용 (환경 변수로 제어)
  const { data: restaurantData, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
      if (import.meta.env.VITE_USE_MOCK_DATA) {
        return Promise.resolve({ data: restaurants });
      }
      // TODO: 실제 API 호출
      return Promise.resolve({ data: [] });
    },
  });

  const { data: postData } = useQuery({
    queryKey: ['posts'],
    queryFn: () => {
      if (import.meta.env.VITE_USE_MOCK_DATA) {
        return Promise.resolve({ data: posts });
      }
      // TODO: 실제 API 호출
      return Promise.resolve({ data: [] });
    },
  });

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
      zoom: 14,
      zoomControl: false,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    naverMapRef.current = map;

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true, // 높은 정확도
        timeout: 5000, // 5초 타임아웃
        maximumAge: 0 // 캐시된 위치 정보 사용하지 않음
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = new window.naver.maps.LatLng(latitude, longitude);
          map.setCenter(newCenter);
          setMapCenter({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting current position:', error);
          let errorMessage = '위치 정보를 가져오는데 실패했습니다.';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
          }
          
          alert(errorMessage);
        },
        options
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

    const options = {
      enableHighAccuracy: true, // 높은 정확도
      timeout: 5000, // 5초 타임아웃
      maximumAge: 0 // 캐시된 위치 정보 사용하지 않음
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = new window.naver.maps.LatLng(latitude, longitude);
        naverMapRef.current.setCenter(newCenter);
        setMapCenter({ latitude, longitude });

        // 기존 마커 제거
        if (currentLocationMarker) {
          currentLocationMarker.setMap(null);
        }

        // 새로운 마커 생성
        const markerOptions = {
          position: newCenter,
          map: naverMapRef.current,
          icon: {
            content: `
              <div class="current-location-marker">
                <div class="marker-icon" style="background-color: #4f46e5">
                  <span>현재</span>
                </div>
              </div>
            `,
            size: new window.naver.maps.Size(38, 58),
            anchor: new window.naver.maps.Point(19, 58),
          },
          zIndex: 1000,
        };

        const newMarker = new window.naver.maps.Marker(markerOptions);
        setCurrentLocationMarker(newMarker);
      },
      (error) => {
        console.error('Error getting current position:', error);
        let errorMessage = '위치 정보를 가져오는데 실패했습니다.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }
        
        alert(errorMessage);
      },
      options
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
    <div className="relative h-[calc(100vh-128px)] md:h-[calc(100vh-64px)] w-full">
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
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <SearchBar 
          onSearch={(keyword) => {
            // TODO: 검색 로직 구현
            console.log('Search:', keyword);
          }} 
        />
      </div>

      {/* 지도 컨트롤 */}
      <div className="absolute bottom-32 right-4 md:bottom-24 md:right-8">
        <MapControls onMyLocation={handleMoveToMyLocation} />
      </div>

      {/* 맛집 추가 버튼 */}
      <div className="absolute bottom-16 right-4 md:bottom-8 md:right-8">
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