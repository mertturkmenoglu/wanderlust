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

export type GetCategoriesResponseDto = {
  categories: GetCategoryByIdResponseDto[];
};

export type GetCategoryByIdResponseDto = {
  id: number;
  name: string;
  image: string;
};

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
