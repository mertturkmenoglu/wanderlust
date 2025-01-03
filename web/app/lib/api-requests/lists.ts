import { Options } from "ky";
import api from "../api";
import {
  CreateListItemRequestDto,
  CreateListItemResponseDto,
  CreateListRequestDto,
  CreateListResponseDto,
  GetAllListsOfUserDto,
  GetListByIdResponseDto,
  GetListStatusResponseDto,
  GetPublicListsOfUserDto,
  Pagination,
  UpdateListRequestDto,
} from "../dto";

export async function createList(dto: CreateListRequestDto) {
  return api
    .post("lists/", {
      json: dto,
    })
    .json<{ data: CreateListResponseDto }>();
}

export async function getListById(id: string, options?: Options) {
  return api
    .get(`lists/${id}`, options)
    .json<{ data: GetListByIdResponseDto }>();
}

export async function getAllListsOfUser(
  page: number,
  pageSize: number,
  options?: Options
) {
  return api
    .get(`lists/?page=${page}&pageSize=${pageSize}`, options)
    .json<{ data: GetAllListsOfUserDto; pagination: Pagination }>();
}

export async function deleteListById(listId: string) {
  return api.delete(`lists/${listId}`);
}

export async function getPublicListsOfUser(
  username: string,
  page: number,
  pageSize: number,
  options?: Options
) {
  return api
    .get(`lists/user/${username}?page=${page}&pageSize=${pageSize}`, options)
    .json<{ data: GetPublicListsOfUserDto; pagination: Pagination }>();
}

export async function getListStatus(poiId: string) {
  return api
    .get(`lists/status/${poiId}`)
    .json<{ data: GetListStatusResponseDto }>();
}

export async function createListItem(listId: string, poiId: string) {
  const dto: CreateListItemRequestDto = {
    poiId,
  };

  return api
    .post(`lists/${listId}/items`, {
      json: dto,
    })
    .json<{ data: CreateListItemResponseDto }>();
}

export async function updateList(id: string, dto: UpdateListRequestDto) {
  return api.patch(`lists/${id}`, {
    json: dto,
  });
}
