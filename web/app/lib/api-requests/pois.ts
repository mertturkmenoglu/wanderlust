import api from "../api";
import { GetPoiByIdResponseDto, PeekPoisResponseDto } from "../dto";

export async function peekPois() {
  return api.get("pois/peek").json<{ data: PeekPoisResponseDto }>();
}

export async function getPoiById(id: string) {
  return api.get(`pois/${id}`).json<{ data: GetPoiByIdResponseDto }>();
}
