package amenities

func (s *service) list() (ListAmenitiesDto, error) {
	res, err := s.repository.list()

	if err != nil {
		return ListAmenitiesDto{}, err
	}

	v := mapToListAmenitiesDto(res)

	return v, nil
}

func (s *service) update(id int32, dto UpdateReqDto) error {
	return s.repository.update(id, dto)
}

func (s *service) create(dto CreateReqDto) (CreateAmenityResDto, error) {
	res, err := s.repository.create(dto)

	if err != nil {
		return CreateAmenityResDto{}, err
	}

	v := mapToCreateAmenityResDto(res)

	return v, nil
}

func (s *service) remove(id int32) error {
	return s.repository.remove(id)
}
