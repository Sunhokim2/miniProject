export interface User {
  id: number;
  user_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  role: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  restaurant_id: number;
}

// 더미데이터
export const users: User[] = [
  {
    id: 1,
    user_name: "김맛집",
    email: "foodie@example.com",
    password: "hashed_password_1",
    email_verified: true,
    role: "USER",
    created_at: "2024-01-01T00:00:00"
  },
  {
    id: 2,
    user_name: "초밥러버",
    email: "sushi@example.com",
    password: "hashed_password_2",
    email_verified: true,
    role: "USER",
    created_at: "2024-01-02T00:00:00"
  },
  {
    id: 3,
    user_name: "맛집탐험가",
    email: "explorer@example.com",
    password: "hashed_password_3",
    email_verified: true,
    role: "USER",
    created_at: "2024-01-03T00:00:00"
  }
];

export const bookmarks: Bookmark[] = [
  {
    id: 1,
    user_id: 1,
    restaurant_id: 1
  },
  {
    id: 2,
    user_id: 1,
    restaurant_id: 2
  }
]; 