import { Options } from "ky";
import api from "../api";
import {
  CreateCollectionRequestDto,
  GetCollectionByIdResponseDto,
  GetCollectionsResponseDto,
  UpdateCollectionRequestDto,
} from "../dto";

export function getCollections(
  page: number,
  pageSize: number,
  options?: Options
) {
  return api
    .get(`collections/?page=${page}&pageSize=${pageSize}`, options)
    .json<{ data: GetCollectionsResponseDto }>();
}

export function getCollectionById(id: string, options?: Options) {
  return api
    .get(`collections/${id}`, options)
    .json<{ data: GetCollectionByIdResponseDto }>();
}

export function createCollection(dto: CreateCollectionRequestDto) {
  return api
    .post(`collections/`, {
      json: dto,
    })
    .json<{ data: GetCollectionByIdResponseDto }>();
}

export function deleteCollection(id: string) {
  return api.delete(`collections/${id}`);
}

export function updateCollection(id: string, dto: UpdateCollectionRequestDto) {
  return api.patch(`collections/${id}`, {
    json: dto,
  });
}
