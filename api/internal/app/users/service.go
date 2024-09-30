package users

import (
	"context"
	"errors"
	"mime/multipart"
	"wanderlust/config"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"
	"wanderlust/internal/upload"

	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
	"github.com/spf13/viper"
)

func (s *service) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	res, err := s.repository.GetUserProfile(username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileByUsernameRow{}, ErrUserNotFound
		}

		return db.GetUserProfileByUsernameRow{}, api.InternalServerError
	}

	return res, nil
}

func (s *service) makeUserVerified(id string) error {
	return s.repository.makeUserVerified(id)
}

func (s *service) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (UpdateUserProfileResponseDto, error) {
	res, err := s.repository.updateUserProfile(id, dto)

	if err != nil {
		return UpdateUserProfileResponseDto{}, err
	}

	v := mapUpdateUserProfileResponseToDto(res)

	return v, nil
}

func (s *service) validateProfileImageMPF(mpf *multipart.Form) error {
	files := mpf.File["files"]

	if files == nil {
		return upload.ErrInvalidNumberOfFiles
	}

	num := len(files)

	if !isAllowedCount(num) {
		return upload.ErrInvalidNumberOfFiles
	}

	// Check content type and size
	for _, f := range files {
		mime := f.Header.Get("Content-Type")

		if !isAllowedMimeType(mime) {
			return upload.ErrInvalidMimeType
		}

		if !isAllowedFileSize(f.Size) {
			return upload.ErrFileTooBig
		}
	}

	return nil
}

func (s *service) updateProfileImage(user db.User, mpf *multipart.Form) (string, error) {
	files := mpf.File["files"]

	if files == nil || len(files) != 1 {
		return "", upload.ErrInvalidNumberOfFiles
	}

	f := files[0]
	file, err := f.Open()

	if err != nil {
		return "", err
	}

	defer file.Close()

	mimeType := f.Header.Get("Content-Type")
	fileExtension, err := upload.GetFileExtensionFromMimeType(mimeType)

	if err != nil {
		return "", err
	}

	// username + file extension is the file name
	fileName := user.Username + "." + fileExtension

	info, err := s.uploadClient.Client.PutObject(
		context.Background(),
		"profile-images",
		fileName,
		file,
		int64(f.Size),
		minio.PutObjectOptions{},
	)

	if err != nil {
		return "", err
	}

	url := "//" + viper.GetString(config.MINIO_ENDPOINT) + "/" + info.Bucket + "/" + info.Key

	err = s.repository.updateProfileImage(user.ID, url)

	if err != nil {
		return "", err
	}

	// Remove old image
	// Could be optimized but i can't be bothered right now. maybe later.
	for _, mime := range allowedMimeTypes {
		ext, _ := upload.GetFileExtensionFromMimeType(mime)

		if ext == fileExtension {
			// Skip the current file extension
			continue
		}

		name := user.Username + "." + ext
		_ = s.uploadClient.Client.RemoveObject(context.Background(), "profile-images", name, minio.RemoveObjectOptions{})
	}

	return url, nil
}
