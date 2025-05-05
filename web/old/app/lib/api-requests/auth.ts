import { Options } from "ky";
import api from "../api";
import { GetMeResponseDto } from "../dto";

export async function getMe(options?: Options) {
  return api.get("auth/me", options).json<{ data: GetMeResponseDto }>();
}
