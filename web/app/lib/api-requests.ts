import { Options } from "ky";
import api from "./api";
import {
  CreateAmenityRequestDto,
  CreateAmenityResponseDto,
  GetAmenitiesResponseDto,
  GetCategoriesResponseDto,
  GetCitiesResponseDto,
  GetCityByIdResponseDto,
  GetMeResponseDto,
  GetPoiByIdResponseDto,
  GetUserProfileResponseDto,
  PeekPoisResponseDto,
  UpdateAmenityRequestDto,
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

export async function getFeaturedCities() {
  return api.get("cities/featured").json<{ data: GetCitiesResponseDto }>();
}

export async function getCategories() {
  return api.get("categories/").json<{ data: GetCategoriesResponseDto }>();
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
