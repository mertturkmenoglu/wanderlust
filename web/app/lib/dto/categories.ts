export type GetCategoriesResponseDto = {
  categories: GetCategoryByIdResponseDto[];
};

export type GetCategoryByIdResponseDto = {
  id: number;
  name: string;
  image: string;
};
