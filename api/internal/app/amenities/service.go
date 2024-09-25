package amenities

import "wanderlust/internal/db"

func (s *service) getAmenities() ([]db.Amenity, error) {
	res, err := s.repository.getAmenities()

	if err != nil {
		return nil, err
	}

	return res, nil
}
