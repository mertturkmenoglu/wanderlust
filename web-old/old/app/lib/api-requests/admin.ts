import api from "../api";
import {
  CreateAmenityRequestDto,
  CreateAmenityResponseDto,
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  CreateCityRequestDto,
  CreateCityResponseDto,
  UpdateAmenityRequestDto,
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
  UpdateCityRequestDto,
  UpdateCityResponseDto,
} from "../dto";

/*
 * Amenities
 */

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

/*
 * Categories
 */

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

/*
 * Cities
 */

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

/*
 * Users
 */

export async function makeUserVerified(username: string) {
  return api.post(`users/${username}/make-verified`);
}
