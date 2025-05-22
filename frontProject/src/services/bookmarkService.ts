import api from './api';
import { Bookmark, Restaurant, ApiResponse, PaginatedResponse } from '@/types';

// 인터페이스 정의
interface BookmarkParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

// 북마크 목록 조회 API
export const getBookmarks = async (params: BookmarkParams = {}): Promise<PaginatedResponse<Bookmark>> => {
  try {
    const response = await api.get<PaginatedResponse<Bookmark>>('/bookmarks', { params });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 목록을 불러오는데 실패했습니다.');
  }
};

// 북마크된 레스토랑 목록 조회 API
export const getBookmarkedRestaurants = async (params: BookmarkParams = {}): Promise<PaginatedResponse<Restaurant>> => {
  try {
    const response = await api.get<PaginatedResponse<Restaurant>>('/bookmarks/restaurants', { params });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크된 레스토랑 목록을 불러오는데 실패했습니다.');
  }
};

// 북마크 추가 API
export const addBookmark = async (restaurantId: number): Promise<ApiResponse<Bookmark>> => {
  try {
    const response = await api.post<ApiResponse<Bookmark>>('/bookmarks', { restaurant_id: restaurantId });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 추가에 실패했습니다.');
  }
};

// 북마크 삭제 API
export const removeBookmark = async (bookmarkId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/bookmarks/${bookmarkId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 삭제에 실패했습니다.');
  }
};

// 레스토랑 ID로 북마크 삭제 API
export const removeBookmarkByRestaurantId = async (restaurantId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/bookmarks/restaurant/${restaurantId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 삭제에 실패했습니다.');
  }
}; 