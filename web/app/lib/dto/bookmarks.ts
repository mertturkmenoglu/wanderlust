export type CreateBookmarkRequestDto = {
  poiId: string;
};

export type CreateBookmarkResponseDto = {
  id: number;
  poiId: string;
  userId: string;
  createdAt: string;
};

export type GetUserBookmarksResponseDto = {
  bookmarks: GetBookmarkByIdResponseDto[];
};

export type GetBookmarkByIdResponseDto = {
  id: number;
  poiId: string;
  poi: BookmarkPoi;
  userId: string;
  createdAt: string;
};

export type BookmarkPoi = {
  id: string;
  name: string;
  addressId: number;
  address: BookmarkPoiAddress;
  categoryId: number;
  category: BookmarkPoiCategory;
  firstMedia: BookmarkPoiMedia;
};

export type BookmarkPoiAddress = {
  id: number;
  cityId: number;
  city: BookmarkPoiCity;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type BookmarkPoiCity = {
  id: number;
  name: string;
  stateCode: string;
  stateName: string;
  countryCode: string;
  countryName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  description: string;
};

export type BookmarkPoiCategory = {
  id: number;
  name: string;
  image: string;
};

export type BookmarkPoiMedia = {
  id: number;
  poiId: string;
  url: string;
  thumbnail: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  mediaOrder: number;
  extension: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
};
