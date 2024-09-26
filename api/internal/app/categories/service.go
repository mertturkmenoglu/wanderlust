package categories

import "wanderlust/internal/db"

func (s *service) getCategories() ([]db.Category, error) {
	res, err := s.repository.getCategories()

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) createCategory(dto CreateCategoryRequestDto) (CreateCategoryResponseDto, error) {
	res, err := s.repository.createCategory(dto)

	if err != nil {
		return CreateCategoryResponseDto{}, err
	}

	v := mapCreateCategoryResponseToDto(res)

	return v, nil
}

func (s *service) deleteCategory(id int16) error {
	return s.repository.deleteCategory(id)
}

func (s *service) updateCategory(id int16, dto UpdateCategoryRequestDto) (UpdateCategoryResponseDto, error) {
	res, err := s.repository.updateCategory(id, dto)

	if err != nil {
		return UpdateCategoryResponseDto{}, err
	}

	v := mapUpdateCategoryResponseToDto(res)

	return v, nil
}
