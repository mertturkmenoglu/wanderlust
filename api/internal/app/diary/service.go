package diary

import (
	"errors"
	"mime/multipart"
	"wanderlust/internal/pkg/upload"

	"github.com/jackc/pgx/v5"
)

func (s *service) listDiaryEntries(userId string) (ListDiaryEntriesResponseDto, error) {
	res, err := s.repository.listDiaryEntries(userId)

	if err != nil {
		return ListDiaryEntriesResponseDto{}, err
	}

	v := mapToListDiaryEntriesResponseDto(res)

	return v, nil
}

func (s *service) createNewDiaryEntry(userId string, dto CreateDiaryEntryRequestDto) (CreateDiaryEntryResponseDto, error) {
	res, err := s.repository.createNewDiaryEntry(userId, dto)

	if err != nil {
		return CreateDiaryEntryResponseDto{}, err
	}

	resDto := mapToCreateDiaryEntryResponseDto(res)

	return resDto, nil
}

func (s *service) validateMediaMPF(mpf *multipart.Form) error {
	validator := sImageUploadValidator{
		mpf: mpf,
	}

	return validator.Validate()
}

func (s *service) uploadMedia(id string, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		mpf:    mpf,
		client: s.di.Upload,
	}

	fileInfo, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer fileInfo.file.Close()

	url, err := uploader.UploadFile(fileInfo)

	if err != nil {
		return "", upload.ErrInvalidFile
	}

	err = s.repository.addMedia(id, url, fileInfo)

	if err != nil {
		return "", err
	}

	return url, nil
}

func (s *service) getDiaryEntryById(id string) (GetDiaryEntryByIdResponseDto, error) {
	res, err := s.repository.getDiaryEntryById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetDiaryEntryByIdResponseDto{}, ErrDiaryEntryNotFound
		}

		return GetDiaryEntryByIdResponseDto{}, err
	}

	v := mapToGetDiaryEntryByIdResponseDto(res)

	return v, nil
}

func (s *service) changeSharing(id string) error {
	return s.repository.changeSharing(id)
}
