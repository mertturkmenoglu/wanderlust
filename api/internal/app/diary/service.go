package diary

import (
	"errors"
	"mime/multipart"
	"wanderlust/internal/pkg/cache"
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
	key := cache.KeyBuilder(cache.KeyDiaryEntry, id)

	if s.di.Cache.Has(key) {
		var res GetDiaryEntryByIdResponseDto

		err := s.di.Cache.ReadObj(key, &res)

		if err == nil {
			return res, nil
		}
	}

	res, err := s.repository.getDiaryEntryById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetDiaryEntryByIdResponseDto{}, ErrDiaryEntryNotFound
		}

		return GetDiaryEntryByIdResponseDto{}, err
	}

	v := mapToGetDiaryEntryByIdResponseDto(res)

	_ = s.di.Cache.SetObj(key, v, cache.TTLDiaryEntry)

	return v, nil
}

func (s *service) changeSharing(id string) error {
	return s.repository.changeSharing(id)
}

func (s *service) invalidateDiaryEntryCache(id string) error {
	key := cache.KeyBuilder(cache.KeyDiaryEntry, id)
	return s.di.Cache.Del(key)
}
