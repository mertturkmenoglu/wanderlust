export type GetUserProfileResponseDto = {
  id: string;
  username: string;
  fullName: string;
  isBusinessAccount: boolean;
  isVerified: boolean;
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

export type UpdateUserProfileRequestDto = {
  fullName: string | null;
  bio: string | null;
  pronouns: string | null;
  website: string | null;
  phone: string | null;
};

export type UpdateUserProfileResponseDto = GetUserProfileResponseDto;
