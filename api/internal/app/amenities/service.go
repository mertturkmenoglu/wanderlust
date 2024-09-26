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

func (s *service) createAmenity(dto CreateAmenityRequestDto) (CreateAmenityResponseDto, error) {
	res, err := s.repository.createAmenity(dto)

	if err != nil {
		return CreateAmenityResponseDto{}, err
	}

	v := mapCreateAmenityResponseToDto(res)

	return v, nil
}

func (s *service) deleteAmenity(id int32) error {
	return s.repository.deleteAmenity(id)
}
