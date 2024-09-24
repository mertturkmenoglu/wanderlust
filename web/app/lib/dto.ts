/// AUTH

export type ResetPasswordRequestDto = {
  email: string;
  code: string;
  newPassword: string;
};

export type AuthDto = {
  data: GetMeResponseDto;
};

export type GetMeResponseDto = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  googleId: string | null;
  isEmailVerified: boolean;
  isOnboardingCompleted: boolean;
  isActive: boolean;
  role: string;
  gender: string | null;
  profileImage: string | null;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

// CITIES

export type GetCityByIdResponseDto = {
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

export type GetCitiesResponseDto = {
  cities: GetCityByIdResponseDto[];
};

/// CATEGORIES

export type GetCategoriesResponseDto = {
  categories: GetCategoryByIdResponseDto[];
};

export type GetCategoryByIdResponseDto = {
  id: number;
  name: string;
  image: string;
};

/// USERS

export type GetUserProfileResponseDto = {
  id: string;
  username: string;
  fullName: string;
  isBusinessAccount: boolean;
  isVerified: boolean;
  gender: string | null;
  bio: string | null;
  pronouns: string | null;
  website: string | null;
  phone: string | null;
  profileImage: string | null;
  bannerImage: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
};

/// POIS

export type OpenTimesSingle = {
  day: string;
  open: string | null;
  close: string | null;
  closed: boolean;
};

export type OpenTimes = OpenTimesSingle[];

export type PeekPoisResponseDto = {
  pois: PeekPoisItemDto[];
};

export type PeekPoisItemDto = {
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
  openTimes: OpenTimes;
  createdAt: string;
  updatedAt: string;
};

export type CreateMediaDto = {
  type: "image" | "video";
  url: string;
  thumbnail: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type GetPoiByIdResponseDto = {
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
  openTimes: OpenTimesSingle[];
  createdAt: string;
  updatedAt: string;
  category: Category;
  amenities: Amenity[];
  media: Media[];
  address: Address;
};

export type Category = {
  id: number;
  name: string;
  image: string;
};

export type Media = {
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

export type Amenity = {
  id: number;
  name: string;
};

export type Address = {
  id: number;
  cityId: number;
  city: City;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type City = {
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
