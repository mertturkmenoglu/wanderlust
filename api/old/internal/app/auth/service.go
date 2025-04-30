package auth

import (
	"fmt"

	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"
)

func (s *service) createUserFromCredentialsInfo(dto RegisterRequestDto) (*db.User, error) {
	user, err := s.repository.createUserFromCredentialsInfo(dto)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) getEmailVerifyUrl(code string) string {
	cfg := config.GetConfiguration()
	return fmt.Sprintf(
		"%s/api/auth/verify-email/verify?code=%s",
		cfg.GetString(config.API_URL),
		code,
	)
}

func (s *service) verifyUserEmail(userId string) error {
	return s.repository.verifyUserEmail(userId)
}

func (s *service) updateUserPassword(userId string, plainPassword string) error {
	hashed, err := hash.Hash(plainPassword)

	if err != nil {
		return ErrHash.Err
	}

	return s.repository.updateUserPassword(userId, hashed)
}
