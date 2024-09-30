import api from "../api";
import {
  GetUserProfileResponseDto,
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
} from "../dto";

export async function getUserByUsername(username: string) {
  return api
    .get(`users/${username}`)
    .json<{ data: GetUserProfileResponseDto }>();
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
