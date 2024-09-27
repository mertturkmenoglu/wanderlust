import { Options } from "ky";
import api from "./api";
import {
  CreateAmenityRequestDto,
  CreateAmenityResponseDto,
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  CreateCityRequestDto,
  CreateCityResponseDto,
  GetAmenitiesResponseDto,
  GetCategoriesResponseDto,
  GetCitiesResponseDto,
  GetCityByIdResponseDto,
  GetMeResponseDto,
  GetPoiByIdResponseDto,
  GetUserProfileResponseDto,
  PeekPoisResponseDto,
  UpdateAmenityRequestDto,
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
  UpdateCityRequestDto,
  UpdateCityResponseDto,
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
} from "./dto";

export async function getMe(options?: Options) {
  return api.get("auth/me", options).json<{ data: GetMeResponseDto }>();
}

export async function getCities() {
  return api.get("cities/").json<{ data: GetCitiesResponseDto }>();
}

export async function getCityById(id: string) {
  return api.get(`cities/${id}`).json<{ data: GetCityByIdResponseDto }>();
}

export async function getUserByUsername(username: string) {
  return api
    .get(`users/${username}`)
    .json<{ data: GetUserProfileResponseDto }>();
}

export async function makeUserVerified(username: string) {
  return api.post(`users/${username}/make-verified`);
}

export async function updateUserProfile(dto: UpdateUserProfileRequestDto) {
  return api
    .patch("users/profile", {
      json: dto,
    })
    .json<{ data: UpdateUserProfileResponseDto }>();
}

export async function getFeaturedCities() {
  return api.get("cities/featured").json<{ data: GetCitiesResponseDto }>();
}

export async function createCity(dto: CreateCityRequestDto) {
  return api
    .post("cities/", {
      json: dto,
    })
    .json<{ data: CreateCityResponseDto }>();
}

export async function updateCity(id: number, dto: UpdateCityRequestDto) {
  return api
    .patch(`cities/${id}`, {
      json: dto,
    })
    .json<{ data: UpdateCityResponseDto }>();
}

export async function deleteCity(id: number) {
  return api.delete(`cities/${id}`);
}

export async function getCategories() {
  return api.get("categories/").json<{ data: GetCategoriesResponseDto }>();
}

export async function deleteCategory(id: number) {
  return api.delete(`categories/${id}`);
}

export async function createCategory(dto: CreateCategoryRequestDto) {
  return api
    .post("categories/", {
      json: dto,
    })
    .json<{ data: CreateCategoryResponseDto }>();
}

export async function updateCategory(
  id: number,
  dto: UpdateCategoryRequestDto
) {
  return api
    .patch(`categories/${id}`, {
      json: dto,
    })
    .json<{ data: UpdateCategoryResponseDto }>();
}

export async function peekPois() {
  return api.get("pois/peek").json<{ data: PeekPoisResponseDto }>();
}

export async function getPoiById(id: string) {
  return api.get(`pois/${id}`).json<{ data: GetPoiByIdResponseDto }>();
}

export async function getAmenities() {
  return api.get("amenities/").json<{ data: GetAmenitiesResponseDto }>();
}

export async function updateAmenity(id: number, dto: UpdateAmenityRequestDto) {
  return api.patch(`amenities/${id}`, {
    json: dto,
  });
}

export async function createAmenity(dto: CreateAmenityRequestDto) {
  return api
    .post("amenities/", {
      json: dto,
    })
    .json<{ data: CreateAmenityResponseDto }>();
}

export async function deleteAmenity(id: number) {
  return api.delete(`amenities/${id}`);
}
