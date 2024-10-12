import api from "../api";
import { CreateListRequestDto, CreateListResponseDto } from "../dto";

export async function createList(dto: CreateListRequestDto) {
  return api
    .post("lists/", {
      json: dto,
    })
    .json<{ data: CreateListResponseDto }>();
}
