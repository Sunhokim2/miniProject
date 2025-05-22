import api from './api';
import { Restaurant, ApiResponse, PaginatedResponse } from '@/types';

// 인터페이스 정의
interface RestaurantParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

// 레스토랑 목록 조회 API
export const getRestaurants = async (params: RestaurantParams = {}): Promise<PaginatedResponse<Restaurant>> => {
  try {
    const response = await api.get<PaginatedResponse<Restaurant>>('/restaurants', { params });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '레스토랑 목록을 불러오는데 실패했습니다.');
  }
};

// 레스토랑 상세 조회 API
export const getRestaurant = async (id: number): Promise<ApiResponse<Restaurant>> => {
  try {
    const response = await api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '레스토랑 정보를 불러오는데 실패했습니다.');
  }
};

// 레스토랑 생성 API
export const createRestaurant = async (data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> => {
  try {
    const response = await api.post<ApiResponse<Restaurant>>('/restaurants', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '레스토랑 생성에 실패했습니다.');
  }
};

// 레스토랑 수정 API
export const updateRestaurant = async (id: number, data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> => {
  try {
    const response = await api.put<ApiResponse<Restaurant>>(`/restaurants/${id}`, data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '레스토랑 수정에 실패했습니다.');
  }
};

// 레스토랑 삭제 API
export const deleteRestaurant = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/restaurants/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '레스토랑 삭제에 실패했습니다.');
  }
};

// 북마크 추가 API
export const addBookmark = async (restaurantId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(`/restaurants/${restaurantId}/bookmark`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 추가에 실패했습니다.');
  }
};

// 북마크 삭제 API
export const removeBookmark = async (restaurantId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/restaurants/${restaurantId}/bookmark`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '북마크 삭제에 실패했습니다.');
  }
}; 