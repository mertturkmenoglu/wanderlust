package categories

import "wanderlust/internal/db"

func (s *service) getCategories() ([]db.Category, error) {
	res, err := s.repository.getCategories()

	if err != nil {
		return nil, err
	}

	return res, nil
}
