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
