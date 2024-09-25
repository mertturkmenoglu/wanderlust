package amenities

import "wanderlust/internal/db"

func mapGetAmenitiesToDto(v []db.Amenity) GetAmenitiesResponseDto {
	if v == nil {
		return GetAmenitiesResponseDto{
			Amenities: []GetAmenityByIdResponseDto{},
		}
	}

	var amenities []GetAmenityByIdResponseDto

	for _, amenity := range v {
		amenities = append(amenities, mapGetAmenityByIdRowToDto(amenity))
	}

	return GetAmenitiesResponseDto{
		Amenities: amenities,
	}
}

func mapGetAmenityByIdRowToDto(v db.Amenity) GetAmenityByIdResponseDto {
	return GetAmenityByIdResponseDto{
		ID:   int32(v.ID),
		Name: v.Name,
	}
}
