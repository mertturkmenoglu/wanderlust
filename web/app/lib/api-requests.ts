import api from "./api";
import {
  GetCategoriesResponseDto,
  GetCitiesResponseDto,
  GetCityByIdResponseDto,
  GetUserProfileResponseDto,
} from "./dto";

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