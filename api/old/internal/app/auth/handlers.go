package auth

import (
	"fmt"
	"net/http"
	"time"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/core"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/random"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/utils"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *handlers) OAuth(c echo.Context) error {
	sess := mustGetAuthSession(c)
	provider := c.Param("provider")

	if provider != "google" && provider != "facebook" {
		return ErrInvalidProvider
	}

	state, url, err := getOAuthStateAndRedirectUrl(c.Param("provider"))

	// Random string generation could fail
	if err != nil {
		return ErrCreateOAuthState
	}

	// Save the state in the session
	sess.Values["state"] = state
	sess.Save(c.Request(), c.Response())

	// Redirect the user to the provider's OAuth2 login page
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *handlers) OAuthCallback(c echo.Context) error {
	sess := mustGetAuthSession(c)

	provider := c.Param("provider")
	code := c.QueryParam("code")
	state := c.QueryParam("state")

	if provider != "google" && provider != "facebook" {
		return ErrInvalidProvider
	}

	token, err := getOAuthToken(getOAuthTokenParams{
		provider: provider,
		sess:     sess,
		state:    state,
		code:     code,
	})

	if err != nil {
		return err
	}

	// Because this state string is used, it shouldn't be used again.
	// So delete it from the session
	delete(sess.Values, "state")
	sess.Save(c.Request(), c.Response())

	// Hit the Facebook or Google API to fetch user information
	userInfo, err := fetchUserInfo(provider, token)

	if err != nil {
		return err
	}

	userId, err := h.service.getOrCreateUserId(userInfo)

	if err != nil {
		return err
	}

	// Create a new session for the user.
	sessionId := uuid.New().String()
	err = h.service.createSession(sessionId, userId)

	if err != nil {
		return err
	}

	// Save the session
	sess.Options = getAuthSessionOptions()
	sess.Values["user_id"] = userId
	sess.Values["session_id"] = sessionId
	sess.Save(c.Request(), c.Response())

	redirectUrl := h.di.Config.GetString(config.OAUTH_REDIRECT)

	// Redirect user to the frontend application
	return c.Redirect(http.StatusTemporaryRedirect, redirectUrl)
}

func (h *handlers) GetMe(c echo.Context) error {
	user := c.Get("user").(db.User)
	res := mapGetMeResponseToDto(user)

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) Logout(c echo.Context) error {
	sess := mustGetAuthSession(c)

	// Delete the session and remove the cookie
	delete(sess.Values, "user_id")
	sess.Save(c.Request(), c.Response())
	cookie := h.service.resetCookie()
	c.SetCookie(cookie)

	return c.NoContent(http.StatusNoContent)
}

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
