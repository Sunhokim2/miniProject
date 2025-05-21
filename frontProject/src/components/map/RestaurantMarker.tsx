import { useEffect, useState } from 'react';
import { Restaurant } from '@/types';

interface RestaurantMarkerProps {
  restaurant: Restaurant;
  map: any; // 네이버 지도 객체
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantMarker = ({ restaurant, map, onClick }: RestaurantMarkerProps) => {
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (!map || !window.naver) return;

    // TODO: 마커 생성 및 이벤트 연결
    const position = new window.naver.maps.LatLng(
      restaurant.latitude,
      restaurant.longitude
    );

    // 마커 옵션 설정
    const markerOptions = {
      position,
      map,
      title: restaurant.restaurant,
      icon: {
        content: `
          <div class="marker-container" data-id="${restaurant.id}">
            <div class="marker-icon ${restaurant.bookmarked ? 'bookmarked' : ''}" style="background-color: ${getCategoryColor(restaurant.category)}">
              <span>${getShortName(restaurant.restaurant)}</span>
            </div>
          </div>
        `,
        size: new window.naver.maps.Size(38, 58),
        anchor: new window.naver.maps.Point(19, 58),
      },
      zIndex: restaurant.bookmarked ? 100 : 50,
    };

    // 마커 생성
    const newMarker = new window.naver.maps.Marker(markerOptions);

    // 클릭 이벤트 연결
    window.naver.maps.Event.addListener(newMarker, 'click', () => {
      onClick(restaurant);
    });

    setMarker(newMarker);

    // 클린업
    return () => {
      if (newMarker) {
        newMarker.setMap(null);
      }
    };
  }, [restaurant, map, onClick]);

  // 카테고리에 따른 색상 반환
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      한식: '#ff6b6b',
      중식: '#ff922b',
      일식: '#5c940d',
      양식: '#3b5bdb',
      카페: '#cc5de8',
      분식: '#339af0',
      default: '#4f46e5',
    };

    return categoryColors[category] || categoryColors.default;
  };

  // 이름 짧게 처리
  const getShortName = (name: string): string => {
    return name.length > 4 ? name.substring(0, 3) + '..' : name;
  };

  return null; // 실제 마커는 네이버 지도 객체에서 직접 렌더링됨
};

export default RestaurantMarker; 