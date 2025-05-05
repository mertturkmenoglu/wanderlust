export type GetCategoriesResponseDto = {
  categories: GetCategoryByIdResponseDto[];
};

export type GetCategoryByIdResponseDto = {
  id: number;
  name: string;
  image: string;
};

export type CreateCategoryRequestDto = {
  id: number;
  name: string;
  image: string;
};

export type CreateCategoryResponseDto = GetCategoryByIdResponseDto;

export type UpdateCategoryRequestDto = {
  name: string;
  image: string;
};

export type UpdateCategoryResponseDto = GetCategoryByIdResponseDto;
