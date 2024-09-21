import api from './api';
import {
  GetCitiesResponseDto,
  GetCityByIdResponseDto,
  GetUserProfileResponseDto,
} from './dto';
import { getAuthCookie } from './headers';

export async function getCities() {
  return api.get('cities/').json<{ data: GetCitiesResponseDto }>();
}

export async function getCityById(id: string) {
  return api.get(`cities/${id}`).json<{ data: GetCityByIdResponseDto }>();
}

export async function getUserByUsername(username: string) {
  return api
    .get(`users/${username}`, {
      headers: {
        ...getAuthCookie(),
      },
    })
    .json<{ data: GetUserProfileResponseDto }>();
}

export async function getFeaturedCities() {
  return api.get('cities/featured').json<{ data: GetCitiesResponseDto }>();
}
