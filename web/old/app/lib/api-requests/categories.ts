import api from "../api";
import { GetCategoriesResponseDto } from "../dto";

export async function getCategories() {
  return api.get("categories/").json<{ data: GetCategoriesResponseDto }>();
}
