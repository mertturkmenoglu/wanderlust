package reviews

import (
	"errors"

	"github.com/jackc/pgx/v5"
)

func (s *service) createReview(userId string, dto CreateReviewRequestDto) (CreateReviewResponseDto, error) {
	res, err := s.repository.createReview(userId, dto)

	if err != nil {
		return CreateReviewResponseDto{}, err
	}

	v := mapToCreateReviewResponseDto(res)

	return v, nil
}

func (s *service) getReviewById(id string) (GetReviewByIdResponseDto, error) {
	review, err := s.repository.getReviewById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetReviewByIdResponseDto{}, ErrNotFound
		}

		return GetReviewByIdResponseDto{}, err
	}

	media, err := s.repository.getReviewMedia(id)

	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return GetReviewByIdResponseDto{}, err
	}

	v := mapToGetReviewByIdResponseDto(review, media)

	return v, nil
}
