package auth

import (
	"errors"
	"fmt"
	"net/http"
	"time"
	"wanderlust/config"
	"wanderlust/internal/app/api"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"

	"github.com/jackc/pgx/v5"
	"github.com/spf13/viper"
)

func (s *service) resetCookie() *http.Cookie {
	cookie := new(http.Cookie)
	cookie.Name = SESSION_NAME
	cookie.Value = ""
	cookie.Path = "/"
	cookie.Expires = time.Unix(0, 0)
	cookie.MaxAge = -1

	return cookie
}

func (s *service) getOrCreateUserId(user *oauthUser) (string, error) {
	dbUser, err := s.repository.getUserBySocialId(user.provider, user.id)

	// If there's no error, user is found, return id
	if err == nil {
		return dbUser.ID, nil
	}

	// If the error is not pgx.ErrNoRows, return it immediately
	if !errors.Is(err, pgx.ErrNoRows) {
		return "", api.InternalServerError
	}

	// If there are no rows, either user doesn't exists
	// or they are using another OAuth provider, or they are using
	// credentials login and now they logged in with OAuth.
	// Check if the user registered with the same email address
	// they have in their OAuth profile. If so, merge accounts.
	dbUser, err = s.repository.getUserByEmail(user.email)

	if err == nil && dbUser.ID != "" {
		// Merge accounts
		err = s.repository.updateUserSocialId(user.provider, dbUser.ID, user.id)

		if err != nil {
			return "", api.InternalServerError
		}

		return dbUser.ID, nil
	}

	// User doesn't exist yet, create user
	savedId, err := s.repository.createUser(user)

	if err != nil {
		return "", api.InternalServerError
	}

	return savedId, nil
}

func (s *service) createSession(sessionId string, userId string) error {
	err := s.repository.createSession(sessionId, userId)

	if err != nil {
		return api.InternalServerError
	}

	return nil
}

func (s *service) getUserByEmail(email string) (db.User, error) {
	return s.repository.getUserByEmail(email)
}

func (s *service) getUserByUsername(username string) (db.User, error) {
	return s.repository.getUserByUsername(username)
}

func (s *service) createUserFromCredentialsInfo(dto RegisterRequestDto) (*db.User, error) {
	user, err := s.repository.createUserFromCredentialsInfo(dto)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) checkIfEmailOrUsernameIsTaken(email string, username string) error {
	// Check if email is taken
	dbUser, err := s.getUserByEmail(email)

	if err == nil && dbUser.Email != "" {
		return ErrEmailTaken
	}

	// Check if username is taken
	dbUser, err = s.getUserByUsername(username)

	if err == nil && dbUser.Username != "" {
		return ErrUsernameTaken
	}

	return nil
}

func (s *service) getEmailVerifyUrl(code string) string {
	return fmt.Sprintf(
		"%s/api/auth/verify-email/verify?code=%s",
		viper.GetString(config.API_URL),
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
