import { Options } from "ky";
import api from "../api";
import {
  CreateListRequestDto,
  CreateListResponseDto,
  GetListByIdResponseDto,
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
