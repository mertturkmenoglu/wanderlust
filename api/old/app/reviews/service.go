package reviews

import (
	"mime/multipart"
	"wanderlust/internal/pkg/upload"
)

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
