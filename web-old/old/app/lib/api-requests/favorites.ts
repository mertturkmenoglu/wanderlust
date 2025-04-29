import api from "../api";
import {
  CreateFavoriteRequestDto,
  CreateFavoriteResponseDto,
  GetUserFavoritesResponseDto,
  Pagination,
} from "../dto";

export function createFavorite(dto: CreateFavoriteRequestDto) {
  return api
    .post("favorites/", {
      json: dto,
    })
    .json<{ data: CreateFavoriteResponseDto }>();
}

export function deleteFavoriteByPoiId(poiId: string) {
  return api.delete(`favorites/${poiId}`);
}

export function getUserFavorites(page: number, pageSize: number) {
  return api.get(`favorites/?page=${page}&pageSize=${pageSize}`).json<{
    data: GetUserFavoritesResponseDto;
    pagination: Pagination;
  }>();
}

export function getUserFavoritesByUsername(
  username: string,
  page: number,
  pageSize: number
) {
  return api
    .get(`favorites/${username}?page=${page}&pageSize=${pageSize}`)
    .json<{
      data: GetUserFavoritesResponseDto;
      pagination: Pagination;
    }>();
}
