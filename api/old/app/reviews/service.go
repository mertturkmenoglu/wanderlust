package reviews

import (
	"context"
	"errors"
	"mime/multipart"
	"strings"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/upload"

	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
)


func (s *service) deleteReview(id string) error {
	media, err := s.repository.getReviewMedia(id)

	if err != nil {
		return err
	}

	err = s.repository.deleteReview(id)

	if err != nil {
		return err
	}

	bucketName := "reviews"

	for _, m := range media {
		_, after, found := strings.Cut(m.Url, "reviews/")

		if !found {
			continue
		}

		err = s.di.Upload.Client.RemoveObject(context.Background(), bucketName, after, minio.RemoveObjectOptions{})

		if err != nil {
			s.di.Logger.Error("error deleting review media", s.di.Logger.Args("error", err))
		}
	}

	return nil
}

func (s *service) getReviewsByPoiId(id string, params pagination.Params) (GetReviewsByPoiIdResponseDto, int64, error) {
	res, err := s.repository.getReviewsByPoiId(id, params)

	if err != nil {
		return GetReviewsByPoiIdResponseDto{}, 0, err
	}

	total, err := s.repository.countReviewsByPoiId(id)

	if err != nil {
		return GetReviewsByPoiIdResponseDto{}, 0, err
	}

	reviewIds := make([]string, 0)

	for _, r := range res {
		reviewIds = append(reviewIds, r.Review.ID)
	}

	media, err := s.repository.getReviewMediaByReviewIds(reviewIds)

	if err != nil {
		return GetReviewsByPoiIdResponseDto{}, 0, err
	}

	v := mapToGetReviewsByPoiIdResponseDto(res, media)

	return v, total, nil
}

func (s *service) getReviewsByUsername(username string, params pagination.Params) (GetReviewsByUsernameResponseDto, int64, error) {
	res, err := s.repository.getReviewsByUsername(username, params)

	if err != nil {
		return GetReviewsByUsernameResponseDto{}, 0, err
	}

	total, err := s.repository.countReviewsByUsername(username)

	if err != nil {
		return GetReviewsByUsernameResponseDto{}, 0, err
	}

	reviewIds := make([]string, 0)

	for _, r := range res {
		reviewIds = append(reviewIds, r.Review.ID)
	}

	media, err := s.repository.getReviewMediaByReviewIds(reviewIds)

	if err != nil {
		return GetReviewsByUsernameResponseDto{}, 0, err
	}

	v := mapToGetReviewsByUsernameResponseDto(res, media)

	return v, total, nil
}

func (s *service) uploadMedia(id string, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		mpf:    mpf,
		client: s.di.Upload,
	}

	f, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer f.file.Close()

	url, err := uploader.UploadFile(f)

	if err != nil {
		return "", upload.ErrInvalidFile
	}

	err = s.repository.addMedia(id, url)

	if err != nil {
		return "", err
	}

	return url, nil
}

func (s *service) getPoiRatings(id string) (GetPoiRatingsResponseDto, error) {
	res, err := s.repository.getPoiRatings(id)

	if err != nil {
		return GetPoiRatingsResponseDto{}, err
	}

	ratings := make(map[int8]int64)
	var totalVotes int64 = 0

	for i := range 5 {
		ratings[int8(i+1)] = 0
	}

	for _, r := range res {
		ratings[int8(r.Rating)] = r.Count
		totalVotes += r.Count
	}

	return GetPoiRatingsResponseDto{
		Ratings:    ratings,
		TotalVotes: totalVotes,
	}, nil
}
