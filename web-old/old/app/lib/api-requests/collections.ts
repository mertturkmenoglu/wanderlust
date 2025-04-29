import { Options } from "ky";
import api from "../api";
import {
  CollectionsCityDto,
  CollectionsPoiDto,
  CreateCollectionItemRequestDto,
  CreateCollectionItemResponseDto,
  CreateCollectionRequestDto,
  GetCollectionByIdResponseDto,
  GetCollectionItemsResponseDto,
  GetCollectionsResponseDto,
  UpdateCollectionItemsRequestDto,
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

export function getCollectionItems(collectionId: string, options?: Options) {
  return api.get(`collections/${collectionId}/items`, options).json<{
    data: GetCollectionItemsResponseDto;
  }>();
}

export function createCollectionItem(
  collectionId: string,
  dto: CreateCollectionItemRequestDto
) {
  return api
    .post(`collections/${collectionId}/items`, {
      json: dto,
    })
    .json<{ data: CreateCollectionItemResponseDto }>();
}

export function deleteCollectionItem(collectionId: string, poiId: string) {
  return api.delete(`collections/${collectionId}/items/${poiId}`);
}

export function updateCollectionItems(
  collectionId: string,
  dto: UpdateCollectionItemsRequestDto
) {
  return api.patch(`collections/${collectionId}/items`, {
    json: dto,
  });
}

export function createCollectionPoiRelation(id: string, poiId: string) {
  return api.post(`collections/${id}/poi/${poiId}`);
}

export function createCollectionCityRelation(id: string, cityId: number) {
  return api.post(`collections/${id}/city/${cityId}`);
}

export function removeCollectionPoiRelation(id: string, poiId: string) {
  return api.delete(`collections/${id}/poi/${poiId}`);
}

export function removeCollectionCityRelation(id: string, cityId: number) {
  return api.delete(`collections/${id}/city/${cityId}`);
}

export function getCollectionsForPoi(id: string) {
  return api
    .get(`collections/poi/${id}`)
    .json<{ data: GetCollectionByIdResponseDto[] }>();
}

export function getCollectionsForCity(id: number) {
  return api
    .get(`collections/city/${id}`)
    .json<{ data: GetCollectionByIdResponseDto[] }>();
}

export function getAllPoiCollections() {
  return api.get(`collections/poi/all`).json<{ data: CollectionsPoiDto[] }>();
}

export function getAllCityCollections() {
  return api.get(`collections/city/all`).json<{ data: CollectionsCityDto[] }>();
}
