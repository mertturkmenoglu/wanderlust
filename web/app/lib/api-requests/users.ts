import { Options } from "ky";
import api from "../api";
import {
  GetUserFollowersResponseDto,
  GetUserFollowingResponseDto,
  GetUserProfileResponseDto,
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
} from "../dto";

export async function getUserByUsername(username: string, options?: Options) {
  return api.get(`users/${username}`, options).json<{
    data: GetUserProfileResponseDto;
    meta: { isFollowing: boolean };
  }>();
}

export async function updateUserProfile(dto: UpdateUserProfileRequestDto) {
  return api
    .patch("users/profile", {
      json: dto,
    })
    .json<{ data: UpdateUserProfileResponseDto }>();
}

export async function updateUserProfileImage(formData: FormData) {
  return api.post("users/profile-image", {
    body: formData,
  });
}

export async function updateBannerImage(formData: FormData) {
  return api.post("users/banner-image", {
    body: formData,
  });
}

export async function follow(username: string) {
  return api.post(`users/follow/${username}`);
}

export async function getUserFollowers(username: string) {
  return api
    .get(`users/${username}/followers`)
    .json<{ data: GetUserFollowersResponseDto }>();
}

export async function getUserFollowing(username: string) {
  return api
    .get(`users/${username}/following`)
    .json<{ data: GetUserFollowingResponseDto }>();
}
