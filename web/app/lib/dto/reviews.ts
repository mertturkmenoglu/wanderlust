import { Profile } from "./common";

export type CreateReviewRequestDto = {
  poiId: string;
  content: string;
  rating: number;
};

export type CreateReviewResponseDto = {
  id: string;
  poiId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type GetReviewByIdResponseDto = {
  id: string;
  poiId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  poi: ReviewPoiDto;
  user: Profile;
  media: ReviewMediaDto[];
};

export type ReviewPoiDto = {
  id: string;
  name: string;
};

export type ReviewMediaDto = {
  id: number;
  reviewId: string;
  url: string;
  mediaOrder: number;
};
