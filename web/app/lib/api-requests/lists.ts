import { Options } from "ky";
import api from "../api";
import {
  CreateListRequestDto,
  CreateListResponseDto,
  GetAllListsOfUserDto,
  GetListByIdResponseDto,
  Pagination,
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
