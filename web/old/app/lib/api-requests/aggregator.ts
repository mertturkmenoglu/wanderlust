import api from "../api";
import { HomeAggregatorResponseDto } from "../dto";

export async function getHomeAggregation() {
  return api.get("aggregator/home").json<{ data: HomeAggregatorResponseDto }>();
}
