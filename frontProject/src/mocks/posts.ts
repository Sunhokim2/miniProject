export interface Post {
  id: number;
  restaurant_id: number;
  user_id: number;
  restaurant_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export const posts: Post[] = [
  {
    id: 1,
    restaurant_id: 1,
    user_id: 1,
    restaurant_name: "맛있는 돈까스",
    latitude: 37.5665,
    longitude: 126.9780,
    created_at: "2024-03-15T14:30:00Z"
  },
  {
    id: 2,
    restaurant_id: 2,
    user_id: 2,
    restaurant_name: "신선한 초밥",
    latitude: 37.5666,
    longitude: 126.9781,
    created_at: "2024-03-14T18:45:00Z"
  }
]; 