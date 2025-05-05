import api from "../api";
import { GetCitiesResponseDto, GetCityByIdResponseDto } from "../dto";

export async function getCities() {
  return api.get("cities/").json<{ data: GetCitiesResponseDto }>();
}

export async function getCityById(id: string) {
  return api.get(`cities/${id}`).json<{ data: GetCityByIdResponseDto }>();
}

export async function getFeaturedCities() {
  return api.get("cities/featured").json<{ data: GetCitiesResponseDto }>();
}
