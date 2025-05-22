export interface Bookmark {
  id: number;
  user_id: number;
  restaurant_id: number;
}

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
  },
  {
    id: 3,
    user_id: 2,
    restaurant_id: 2
  }
]; 