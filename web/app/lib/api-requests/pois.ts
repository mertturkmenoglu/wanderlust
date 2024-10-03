import { Options } from "ky";
import api from "../api";
import { Draft, GetPoiByIdResponseDto, PeekPoisResponseDto } from "../dto";

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

export async function createDraft(options?: Options) {
  return api.post("pois/drafts/new", options).json<{ data: Draft }>();
}

export async function getDrafts(options?: Options) {
  return api.get("pois/drafts", options).json<{ data: Draft[] | null }>();
}

export async function getDraft(id: string, options?: Options) {
  return api.get(`pois/drafts/${id}`, options).json<{ data: Draft }>();
}

export async function deleteDraft(id: string, options?: Options) {
  return api.delete(`pois/drafts/${id}`, options);
}

export async function updateDraft(id: string, dto: Draft, options?: Options) {
  return api.patch(`pois/drafts/${id}`, {
    json: dto,
    ...options,
  });
}

export async function deleteDraftMedia(draftId: string, name: string) {
  return api.delete(`pois/media?draftId=${draftId}&name=${name}`);
}
