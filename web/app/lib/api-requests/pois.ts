import { Options } from "ky";
import api from "../api";
import { GetPoiByIdResponseDto, PeekPoisResponseDto } from "../dto";

export async function peekPois() {
  return api.get("pois/peek").json<{ data: PeekPoisResponseDto }>();
}

export async function getPoiById(id: string, options?: Options) {
  return api.get(`pois/${id}`, options).json<{
    data: GetPoiByIdResponseDto;
    meta: {
      isFavorite: boolean;
      isBookmarked: boolean;
    };
  }>();
}
