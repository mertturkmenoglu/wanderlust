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
  imageLicense: string | null;
  imageLicenseLink: string | null;
  imageAttribute: string | null;
  imageAttributionLink: string | null;
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
  imageLicense: string;
  imageLicenseLink: string;
  imageAttribute: string;
  imageAttributionLink: string;
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
  imageLicense: string | null;
  imageLicenseLink: string | null;
  imageAttribute: string | null;
  imageAttributionLink: string | null;
};

export type UpdateCityResponseDto = GetCityByIdResponseDto;
