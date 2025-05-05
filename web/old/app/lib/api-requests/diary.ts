import { Options } from "ky";
import api from "../api";
import {
  CreateDiaryEntryRequestDto,
  CreateDiaryEntryResponseDto,
  GetDiaryEntryByIdResponseDto,
  ListDiaryEntriesResponseDto,
  Pagination,
} from "../dto";

export function listDiaryEntries(
  page: number,
  pageSize: number,
  from?: string,
  to?: string,
  options?: Options
) {
  const q = new URLSearchParams();
  q.append("page", "" + page);
  q.append("pageSize", "" + pageSize);

  if (from !== undefined && to !== undefined) {
    q.append("from", from);
    q.append("to", to);
  }

  const params = q.toString();

  return api
    .get(`diary/?${params}`, options)
    .json<{ data: ListDiaryEntriesResponseDto; pagination: Pagination }>();
}

export function getDiaryEntryById(id: string, options?: Options) {
  return api
    .get(`diary/${id}`, options)
    .json<{ data: GetDiaryEntryByIdResponseDto }>();
}

export function createDiaryEntry(dto: CreateDiaryEntryRequestDto) {
  return api
    .post("diary/", {
      json: dto,
    })
    .json<{ data: CreateDiaryEntryResponseDto }>();
}

export function changeDiarySharing(id: string) {
  return api.patch(`diary/${id}/sharing`);
}

export function deleteDiaryEntry(id: string) {
  return api.delete(`diary/${id}`);
}
