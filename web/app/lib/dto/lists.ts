export type CreateListRequestDto = {
  name: string;
  isPublic: boolean;
};

export type CreateListResponseDto = {
  id: string;
  name: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetListByIdResponseDto = {
  id: string;
  name: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  items: ListItemDto[];
};

export type ListItemDto = {
  listId: string;
  poiId: string;
  poi: ListItemPoiDto;
  listIndex: number;
  createdAt: string;
};

export type ListItemPoiDto = {
  id: string;
  name: string;
  description: string;
  addressId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  address: ListItemPoiAddressDto;
  category: ListItemPoiCategoryDto;
  firstMedia: ListItemPoiMedia;
};

export type ListItemPoiMedia = {
  id: number;
  poiId: string;
  url: string;
  alt: string;
  caption: string | null;
  mediaOrder: number;
  createdAt: string;
};

export type ListItemPoiAddressDto = {
  id: number;
  cityId: number;
  city: ListItemPoiAddressCityDto;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type ListItemPoiAddressCityDto = {
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

export type ListItemPoiCategoryDto = {
  id: number;
  name: string;
  image: string;
};
