export interface Restaurant {
  id: number;
  restaurant: string;
  category: string;
  region: string;
  main_menu: string;
  address: string;
  body: string;
  latitude: number;
  longitude: number;
  rate: number;
  source: string;
  status: string;
}

export const restaurants: Restaurant[] = [
  {
    id: 1,
    restaurant: "맛있는 돈까스",
    category: "일식",
    region: "강남구",
    main_menu: "로스까스",
    address: "서울시 강남구 역삼동 123-45",
    body: "부드러운 돈까스와 특제 소스의 조화",
    latitude: 37.5665,
    longitude: 126.9780,
    rate: 4,
    source: "user",
    status: "active"
  },
  {
    id: 2,
    restaurant: "신선한 초밥",
    category: "일식",
    region: "강남구",
    main_menu: "특선 초밥",
    address: "서울시 강남구 역삼동 234-56",
    body: "신선한 생선과 완벽한 밥의 조화",
    latitude: 37.5666,
    longitude: 126.9781,
    rate: 5,
    source: "user",
    status: "active"
  }
]; 