package amenities

import "wanderlust/internal/db"

func (s *service) getAmenities() ([]db.Amenity, error) {
	res, err := s.repository.getAmenities()

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) updateAmenity(id int32, dto UpdateAmenityRequestDto) error {
	err := s.repository.updateAmenity(id, dto)

	if err != nil {
		return err
	}

	return nil
}
