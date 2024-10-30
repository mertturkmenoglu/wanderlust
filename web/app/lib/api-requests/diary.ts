import { Options } from "ky";
import api from "../api";
import {
  CreateDiaryEntryRequestDto,
  CreateDiaryEntryResponseDto,
  GetDiaryEntryByIdResponseDto,
  ListDiaryEntriesResponseDto,
} from "../dto";

export function listDiaryEntries(options?: Options) {
  return api
    .get("diary/", options)
    .json<{ data: ListDiaryEntriesResponseDto }>();
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
