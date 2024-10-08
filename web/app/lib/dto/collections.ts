export type GetCollectionsResponseDto = {
  collections: CollectionDto[];
};

export type CollectionDto = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type GetCollectionByIdResponseDto = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  items: CollectionItemDto[];
};

export type CollectionItemDto = {
  collectionId: string;
  poiId: string;
  poi: CollectionItemPoiDto;
  listIndex: number;
  createdAt: string;
};

export type CollectionItemPoiDto = {
  id: string;
  name: string;
  description: string;
  addressId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  address: CollectionItemPoiAddressDto;
  category: CollectionItemPoiCategoryDto;
  firstMedia: CollectionItemPoiMedia;
};

export type CollectionItemPoiMedia = {
  id: number;
  poiId: string;
  url: string;
  alt: string;
  caption: string | null;
  mediaOrder: number;
  createdAt: string;
};

export type CollectionItemPoiAddressDto = {
  id: number;
  cityId: number;
  city: CollectionItemPoiAddressCityDto;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type CollectionItemPoiAddressCityDto = {
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

export type CollectionItemPoiCategoryDto = {
  id: number;
  name: string;
  image: string;
};

export type CreateCollectionRequestDto = {
  name: string;
  description: string;
};

export type UpdateCollectionRequestDto = {
  name: string;
  description: string;
};

export type GetCollectionItemsResponseDto = {
  items: CollectionItemDto[];
};

export type CreateCollectionItemRequestDto = {
  poiId: string;
};

export type CreateCollectionItemResponseDto = {
  collectionId: string;
  poiId: string;
  listIndex: number;
  createdAt: string;
};

export type UpdateCollectionItemsRequestDto = {};
