import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/types';
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
  const [distanceRange, setDistanceRange] = useState(2); // 기본 거리 2km
  const [markers, setMarkers] = useState<any[]>([]); // 마커 관리를 위한 상태 추가

  // 현재 위치와 거리 범위를 기반으로 주변 맛집 조회
  const { data: nearbyRestaurants, isLoading, error, refetch } = useQuery({
    queryKey: ['nearbyRestaurants', mapCenter, distanceRange],
    queryFn: async () => {
      if (!mapCenter) return [];
      
      console.log('Fetching nearby restaurants with params:', {
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        distance: distanceRange
      });

      const token = localStorage.getItem('token');
      console.log('Current token from localStorage:', token); // 토큰 확인
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      const response = await fetch(
        `http://localhost:8080/api/restaurants/nearby?` +
        `latitude=${mapCenter.latitude}&` +
        `longitude=${mapCenter.longitude}&` +
        `distance=${distanceRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // 요청 헤더 확인
      console.log('Request headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to fetch nearby restaurants: ${response.status} ${errorData.message || ''}`);
      }

      const data = await response.json();
      console.log('Received nearby restaurants:', data);
      return data as Restaurant[];
    },
    enabled: !!mapCenter,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
  });

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
        zoom: 14,
        zoomControl: false,
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        mapTypeControl: false,
        streetLayerControl: false
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      naverMapRef.current = map;

      // 현재 위치 가져오기
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
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
    } catch (error) {
      console.error('네이버 지도 초기화 실패:', error);
      alert('지도를 불러오는데 실패했습니다. 네트워크 연결과 API 키를 확인해주세요.');
    }

    return () => {
      if (naverMapRef.current) {
        naverMapRef.current = null;
      }
    };
  }, []);

  // 마커 표시하기
  useEffect(() => {
    if (!naverMapRef.current || !nearbyRestaurants) return;

    console.log('Updating markers with data:', nearbyRestaurants);

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];
    nearbyRestaurants.forEach((restaurant: Restaurant) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(restaurant.latitude, restaurant.longitude),
        map: naverMapRef.current,
        title: restaurant.restaurant_name,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        handleSelectRestaurant(restaurant);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [nearbyRestaurants]);

  // 레스토랑 선택 핸들러
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    console.log('선택된 레스토랑:', restaurant);
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  // 내 위치로 이동 핸들러
  const handleMoveToMyLocation = () => {
    if (!naverMapRef.current || !navigator.geolocation) return;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
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

        // 현재 위치 변경 시 주변 맛집 데이터 다시 가져오기
        refetch();
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

  // 거리 계산 함수 추가
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 거리 조절 바 변경 핸들러
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = parseFloat(e.target.value);
    setDistanceRange(newDistance);
    refetch(); // 거리 변경 시 데이터 다시 가져오기
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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <SearchBar 
          onSearch={(keyword) => {
            // TODO: 검색 로직 구현
            console.log('Search:', keyword);
          }} 
        />
      </div>

      {/* 거리 조절 바 */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={distanceRange}
          onChange={handleDistanceChange}
          className="w-32"
        />
        <div className="text-center mt-2">{distanceRange} km</div>
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