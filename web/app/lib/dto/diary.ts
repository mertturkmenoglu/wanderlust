import { Profile } from "./common";

export type ListDiaryEntriesResponseDto = {
  entries: DiaryEntryDto[];
};

export type DiaryEntryDto = {
  id: string;
  userId: string;
  title: string;
  description: string;
  shareWithFriends: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDiaryEntryRequestDto = {
  shareWithFriends: boolean;
  title: string;
  description: string;
  date: string;
  friends: string[];
  locations: CreateDiaryEntryLocationDto[];
};

export type CreateDiaryEntryLocationDto = {
  id: string;
  description: string | null;
};

export type CreateDiaryEntryResponseDto = DiaryEntryDto;

export type GetDiaryEntryByIdResponseDto = {
  id: string;
  userId: string;
  title: string;
  description: string;
  shareWithFriends: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
  user: Profile;
  friends: Profile[];
  locations: DiaryLocationDto[];
  media: DiaryMediaDto[];
};

export type DiaryLocationDto = {
  poi: DiaryPoiDto;
  description: string | null;
  listIndex: number;
};

export type DiaryMediaDto = {
  id: number;
  diaryEntryId: string;
  url: string;
  alt: string;
  caption: string | null;
  mediaOrder: number;
  createdAt: string;
};

export type DiaryPoiDto = {
  id: string;
  name: string;
  phone: string | null;
  description: string;
  addressId: number;
  website: string | null;
  priceLevel: number;
  accessibilityLevel: number;
  totalVotes: number;
  totalPoints: number;
  totalFavorites: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: DiaryPoiCategoryDto;
  address: DiaryPoiAddressDto;
  firstMedia: DiaryPoiMediaDto;
};

export type DiaryPoiCategoryDto = {
  id: number;
  name: string;
  image: string;
};

export type DiaryPoiAddressDto = {
  id: number;
  cityId: number;
  city: DiaryPoiCityDto;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type DiaryPoiCityDto = {
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
  imgLicense: string | null;
  imgLicenseLink: string | null;
  imgAttr: string | null;
  imgAttrLink: string | null;
};

export type DiaryPoiMediaDto = {
  id: number;
  poiId: string;
  url: string;
  alt: string;
  caption: string | null;
  mediaOrder: number;
  createdAt: string;
};
