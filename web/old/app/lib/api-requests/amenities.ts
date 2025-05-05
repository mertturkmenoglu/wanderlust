import api from "../api";
import { GetAmenitiesResponseDto } from "../dto";

export async function getAmenities() {
  return api.get("amenities/").json<{ data: GetAmenitiesResponseDto }>();
}
