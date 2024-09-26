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

export type CreateCityRequestDto = {
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

export type CreateCityResponseDto = GetCityByIdResponseDto;

export type UpdateCityRequestDto = {
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

export type UpdateCityResponseDto = GetCityByIdResponseDto;
