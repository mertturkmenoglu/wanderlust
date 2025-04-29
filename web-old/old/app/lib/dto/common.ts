export type Pagination = {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type ErrorResponse = {
  errors: ErrorDto[];
};

export type ErrorDto = {
  status: string;
  code: string;
  title: string;
  detail: string;
};

export type Profile = {
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
