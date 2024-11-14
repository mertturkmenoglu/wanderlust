import api from "../api";
import {
  CreateReviewRequestDto,
  CreateReviewResponseDto,
  GetReviewByIdResponseDto,
  GetReviewsByPoiIdResponseDto,
  GetReviewsByUsernameResponseDto,
  Pagination,
} from "../dto";

export function getReviewById(id: string) {
  return api.get(`reviews/${id}`).json<{ data: GetReviewByIdResponseDto }>();
}

export function createReview(dto: CreateReviewRequestDto) {
  return api
    .post("reviews/", {
      json: dto,
    })
    .json<{ data: CreateReviewResponseDto }>();
}

export function deleteReview(id: string) {
  return api.delete(`reviews/${id}`);
}

export function getReviewsByPoiId(id: string, page: number, pageSize: number) {
  return api
    .get(`reviews/poi/${id}`, {
      searchParams: {
        page,
        pageSize,
      },
    })
    .json<{ data: GetReviewsByPoiIdResponseDto; pagination: Pagination }>();
}

export function getReviewsByUsername(
  username: string,
  page: number,
  pageSize: number
) {
  return api
    .get(`reviews/user/${username}`, {
      searchParams: {
        page,
        pageSize,
      },
    })
    .json<{ data: GetReviewsByUsernameResponseDto; pagination: Pagination }>();
}
