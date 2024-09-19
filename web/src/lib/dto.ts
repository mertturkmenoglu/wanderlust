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
