package amenities

import "wanderlust/internal/pkg/db"

func mapToListAmenitiesDto(v []db.Amenity) ListAmenitiesDto {
	if v == nil {
		return ListAmenitiesDto{
			Amenities: []AmenityDto{},
		}
	}

	var amenities []AmenityDto

	for _, amenity := range v {
		amenities = append(amenities, mapToAmenityDto(amenity))
	}

	return ListAmenitiesDto{
		Amenities: amenities,
	}
}

func mapToAmenityDto(v db.Amenity) AmenityDto {
	return AmenityDto{
		ID:   int32(v.ID),
		Name: v.Name,
	}
}

func mapToCreateAmenityResDto(v db.Amenity) CreateAmenityResDto {
	return CreateAmenityResDto{
		ID:   int32(v.ID),
		Name: v.Name,
	}
}
