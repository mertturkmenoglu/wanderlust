package diary

import (
	"errors"
	"mime/multipart"
	"strings"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"

	"github.com/jackc/pgx/v5"
)

func (s *service) listDiaryEntries(userId string, params DiaryPaginationParams) (ListDiaryEntriesResponseDto, int64, error) {
	if params.From == nil && params.To == nil {
		return s.listDiaryEntriesNoFilter(userId, params)
	}

	return s.listDiaryEntriesFilterByRange(userId, params)
}

func (s *service) listDiaryEntriesNoFilter(userId string, params DiaryPaginationParams) (ListDiaryEntriesResponseDto, int64, error) {
	res, err := s.repository.listDiaryEntries(userId, params)

	if err != nil {
		return ListDiaryEntriesResponseDto{}, 0, err
	}

	count, err := s.repository.countDiaryEntries(userId)

	if err != nil {
		return ListDiaryEntriesResponseDto{}, 0, err
	}

	v := mapToListDiaryEntriesResponseDto(res)

	return v, count, nil
}

func (s *service) listDiaryEntriesFilterByRange(userId string, params DiaryPaginationParams) (ListDiaryEntriesResponseDto, int64, error) {
	res, err := s.repository.listAndFilterDiaryEntries(userId, params)

	if err != nil {
		return ListDiaryEntriesResponseDto{}, 0, err
	}

	count, err := s.repository.countDiaryEntriesFilterByRange(userId, params)

	if err != nil {
		return ListDiaryEntriesResponseDto{}, 0, err
	}

	v := mapToListDiaryEntriesResponseDto(res)

	return v, count, nil
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

func (s *service) deleteDiaryEntry(id string) error {
	media, mediaErr := s.repository.getDiaryMedia(id)

	err := s.repository.deleteDiaryEntry(id)

	if err != nil {
		return err
	}

	if mediaErr != nil {
		return nil
	}

	objectNames := make([]string, 0)

	for _, m := range media {
		_, after, found := strings.Cut(m.Url, "diaries/")

		if !found {
			s.di.Logger.Error("error deleting diary media, cannot extract object name from url", s.di.Logger.Args("url", m.Url))
			continue
		}

		name := after
		objectNames = append(objectNames, name)
	}

	_, err = s.di.Tasks.CreateAndEnqueue(tasks.TypeDeleteDiaryMedia, tasks.DeleteDiaryMediaPayload{
		ObjectNames: objectNames,
	})

	if err != nil {
		s.di.Logger.Error(
			"error deleting diary media",
			s.di.Logger.Args("id", id, "err", err, "media", media, "object names", objectNames),
		)
	}

	return nil
}
