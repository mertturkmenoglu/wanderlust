export type GetAmenitiesResponseDto = {
  amenities: GetAmenityByIdResponseDto[];
};

export type GetAmenityByIdResponseDto = {
  id: number;
  name: string;
};
