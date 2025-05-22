export interface Review {
  id: number;
  restaurantId: number;
  userId: number;
  userName: string;
  userImage: string;
  rating: number;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    restaurantId: 1,
    userId: 1,
    userName: "맛집탐험가",
    userImage: "https://via.placeholder.com/50x50",
    rating: 4.5,
    content: "정말 맛있는 돈까스였습니다. 특히 치즈까스는 꼭 드셔보세요!",
    images: [
      "https://via.placeholder.com/300x200",
      "https://via.placeholder.com/300x200"
    ],
    likes: 24,
    comments: 5,
    createdAt: "2024-03-15T14:30:00Z"
  },
  {
    id: 2,
    restaurantId: 2,
    userId: 2,
    userName: "초밥러버",
    userImage: "https://via.placeholder.com/50x50",
    rating: 5.0,
    content: "신선한 생선과 완벽한 밥의 조화. 정말 최고입니다!",
    images: [
      "https://via.placeholder.com/300x200"
    ],
    likes: 42,
    comments: 8,
    createdAt: "2024-03-14T18:45:00Z"
  }
]; 