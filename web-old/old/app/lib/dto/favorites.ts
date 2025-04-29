export type CreateFavoriteRequestDto = {
  poiId: string;
};

export type CreateFavoriteResponseDto = {
  id: number;
  poiId: string;
  userId: string;
  createdAt: string;
};

export type GetUserFavoritesResponseDto = {
  favorites: GetFavoriteByIdResponseDto[];
};

export type GetFavoriteByIdResponseDto = {
  id: number;
  poiId: string;
  poi: FavoritePoi;
  userId: string;
  createdAt: string;
};

export type FavoritePoi = {
  id: string;
  name: string;
  addressId: number;
  address: FavoritePoiAddress;
  categoryId: number;
  category: FavoritePoiCategory;
  media: FavoritePoiMedia;
};

export type FavoritePoiAddress = {
  id: number;
  cityId: number;
  city: FavoritePoiCity;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type FavoritePoiCity = {
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

export type FavoritePoiCategory = {
  id: number;
  name: string;
  image: string;
};

export type FavoritePoiMedia = {
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
