import api from "../api";
import {
  CreateBookmarkRequestDto,
  CreateBookmarkResponseDto,
  GetUserBookmarksResponseDto,
  Pagination,
} from "../dto";

export function createBookmark(dto: CreateBookmarkRequestDto) {
  return api
    .post("bookmarks/", {
      json: dto,
    })
    .json<{ data: CreateBookmarkResponseDto }>();
}

export function deleteBookmarkByPoiId(poiId: string) {
  return api.delete(`bookmarks/${poiId}`);
}

export function getUserBookmarks(page: number, pageSize: number) {
  return api.get(`bookmarks/?page=${page}&pageSize=${pageSize}`).json<{
    data: GetUserBookmarksResponseDto;
    pagination: Pagination;
  }>();
}
