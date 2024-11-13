import api from "../api";
import {
  CreateReviewRequestDto,
  CreateReviewResponseDto,
  GetReviewByIdResponseDto,
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
