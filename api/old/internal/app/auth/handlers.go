package auth

import (
	"fmt"
	"net/http"
	"time"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/random"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/utils"

	"github.com/labstack/echo/v4"
)

func (s *handlers) SendVerificationEmail(c echo.Context) error {
	body := c.Get("body").(SendVerificationEmailRequestDto)
	user, err := s.service.getUserByEmail(body.Email)

	if err != nil {
		return ErrInvalidEmail
	}

	if user.IsEmailVerified {
		return ErrEmailAlreadyVerified
	}

	code, err := random.DigitsString(6)

	if err != nil {
		return echo.ErrInternalServerError
	}

	key := fmt.Sprintf("verify-email:%s", code)
	s.di.Cache.Set(key, body.Email, time.Minute*15)

	url := s.service.getEmailVerifyUrl(code)

	_, err = s.di.Tasks.CreateAndEnqueue(tasks.TypeVerifyEmailEmail, tasks.VerifyEmailEmailPayload{
		Email: body.Email,
		Url:   url,
	})

	if err != nil {
		return errs.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}

func (s *handlers) VerifyEmail(c echo.Context) error {
	code := c.QueryParam("code")

	if code == "" {
		return ErrMalformedOrMissingVerifyToken
	}

	key := fmt.Sprintf("verify-email:%s", code)

	if !s.di.Cache.Has(key) {
		return ErrInvalidOrExpiredVerifyCode
	}

	email, err := s.di.Cache.Get(key)

	if err != nil {
		return errs.InternalServerError
	}

	user, err := s.service.getUserByEmail(email)

	if err != nil {
		return err
	}

	if user.IsEmailVerified {
		return ErrEmailAlreadyVerified
	}

	err = s.service.verifyUserEmail(user.ID)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

func (s *handlers) SendForgotPasswordEmail(c echo.Context) error {
	body := c.Get("body").(SendForgotPasswordEmailRequestDto)
	_, err := s.service.getUserByEmail(body.Email)

	if err != nil {
		return utils.HandleDbErr(c, err)
	}

	code, err := random.DigitsString(6)

	if err != nil {
		return errs.InternalServerError
	}

	key := fmt.Sprintf("forgot-password:%s", code)
	s.di.Cache.Set(key, body.Email, time.Minute*15)

	_, err = s.di.Tasks.CreateAndEnqueue(tasks.TypeForgotPasswordEmail, tasks.ForgotPasswordEmailPayload{
		Email: body.Email,
		Code:  code,
	})

	if err != nil {
		return errs.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}

func (s *handlers) ResetPassword(c echo.Context) error {
	body := c.Get("body").(ResetPasswordRequestDto)
	user, err := s.service.getUserByEmail(body.Email)

	if err != nil {
		return ErrInvalidEmail
	}

	key := fmt.Sprintf("forgot-password:%s", body.Code)
	cacheVal, err := s.di.Cache.Get(key)

	if err != nil {
		return ErrPasswordResetCodeExpiredOrInvalid
	}

	if cacheVal != body.Email {
		return ErrPasswordResetCodeExpiredOrInvalid
	}

	err = s.service.updateUserPassword(user.ID, body.NewPassword)

	if err != nil {
		return err
	}

	err = s.di.Cache.Del(key)

	if err != nil {
		return errs.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}
