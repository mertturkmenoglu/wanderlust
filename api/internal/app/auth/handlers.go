package auth

import (
	"fmt"
	"net/http"
	"time"
	"wanderlust/config"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"
	"wanderlust/internal/hash"
	"wanderlust/internal/random"
	"wanderlust/internal/tasks"
	"wanderlust/internal/utils"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

// OAuth Login godoc
//
//	@Summary		Login with an OAuth provider
//	@Description	Logs in the user with Google or Facebook OAuth
//	@Tags			Auth
//	@Param			provider	path	string	true	"Provider"
//	@Success		307
//	@Failure		400	{object}	api.ErrorResponse	"Invalid provider"
//	@Failure		500	{object}	api.ErrorResponse "Internal Server Error"
//	@Router			/auth/{provider} [get]
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

// OAuth Callback godoc
//
//	@Summary		OAuth callback
//	@Description	OAuth callback for Google or Facebook
//	@Tags			Auth
//	@Param			provider	path	string	true	"Provider"
//	@Success		307
//	@Failure		400	{object}	api.ErrorResponse	"Invalid provider"
//	@Failure		500	{object}	api.ErrorResponse "Internal Server Error"
//	@Router			/auth/{provider}/callback [get]
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
	redirectUrl := viper.GetString(config.OAUTH_REDIRECT)

	// Redirect user to the frontend application
	return c.Redirect(http.StatusTemporaryRedirect, redirectUrl)
}

// Get Me godoc
//
//	@Summary		Gets the current user
//	@Description	Gets the currently authenticated user or returns an error
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	api.Response{data=GetMeResponseDto}
//	@Failure		401	{object}	ErrorResponse
//	@Router			/auth/me [get]
func (h *handlers) GetMe(c echo.Context) error {
	user := c.Get("user").(db.User)
	res := mapGetMeResponseToDto(user)

	return c.JSON(http.StatusOK, echo.Map{
		"data": res,
	})
}

// Logout godoc
//
//	@Summary		Logs out the current user
//	@Description	Logs out the current user
//	@Tags			Auth
//	@Accept			json
//	@Success		204
//	@Failure		401	{object}	api.ErrorResponse
//	@Failure		500	{object}	api.ErrorResponse
//	@Router			/auth/logout [post]
func (h *handlers) Logout(c echo.Context) error {
	sess := mustGetAuthSession(c)

	// Delete the session and remove the cookie
	delete(sess.Values, "user_id")
	sess.Save(c.Request(), c.Response())
	cookie := h.service.resetCookie()
	c.SetCookie(cookie)

	return c.NoContent(http.StatusNoContent)
}

// Credentials Login godoc
//
//	@Summary		Login with email and password
//	@Description	Logs in the user with email and password
//	@Tags			Auth
//	@Accept			json
//	@Param			body	body	LoginRequestDto	true	"Request body"
//	@Success		200
//	@Failure		400	{object}	api.ErrorResponse	"Invalid email or password"
//	@Failure		500	{object}	api.ErrorResponse	"Internal Server Error"
//	@Router			/auth/credentials/login [post]
func (h *handlers) CredentialsLogin(c echo.Context) error {
	sess := mustGetAuthSession(c)
	body := c.Get("body").(LoginRequestDto)
	user, dbErr := h.service.getUserByEmail(body.Email)
	var hashed = ""

	if dbErr == nil {
		hashed = user.PasswordHash.String
	}

	matched, verifyErr := hash.Verify(body.Password, hashed)

	// If the passwords don't match, or there's an error, return a generic error message.
	if !matched || dbErr != nil || verifyErr != nil {
		return ErrInvalidEmailOrPassword
	}

	sessionId := uuid.New().String()
	err := h.service.createSession(sessionId, user.ID)

	if err != nil {
		return err
	}

	sess.Options = getAuthSessionOptions()
	sess.Values["user_id"] = user.ID
	sess.Values["session_id"] = sessionId
	sess.Save(c.Request(), c.Response())

	return c.NoContent(http.StatusOK)
}

// Credentials Register godoc
//
//	@Summary		Register with email and password
//	@Description	Registers a new user with email and password
//	@Tags			Auth
//	@Accept			json
//	@Param			body	body	RegisterRequestDto	true	"Request body"
//	@Success		201
//	@Failure		400	{object}	api.ErrorResponse	"Invalid email or username"
//	@Failure		500	{object}	api.ErrorResponse	"Internal Server Error"
//	@Router			/auth/credentials/register [post]
func (h *handlers) CredentialsRegister(c echo.Context) error {
	body := c.Get("body").(RegisterRequestDto)
	err := h.service.checkIfEmailOrUsernameIsTaken(body.Email, body.Username)

	if err != nil {
		return err
	}

	// Check username characters
	ok := isValidUsername(body.Username)

	if !ok {
		return ErrUsernameChars
	}

	_, err = h.service.createUserFromCredentialsInfo(body)

	if err != nil {
		return err
	}

	h.tasks.CreateAndEnqueue(tasks.TypeWelcomeEmail, tasks.WelcomeEmailPayload{
		Email: body.Email,
		Name:  body.FullName,
	})

	return c.NoContent(http.StatusCreated)
}

// Send Verification Email godoc
//
//	@Summary		Send verification email
//	@Description	Sends a verification email to the user
//	@Tags			Auth
//	@Accept			json
//	@Param			body	body	SendVerificationEmailRequestDto	true	"Request body"
//	@Success		200
//	@Failure		400	{object}	echo.HTTPError	"Invalid email or email already verified"
//	@Failure		500	{object}	echo.HTTPError	"Internal Server Error"
//	@Router			/auth/verify-email/send [post]
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
	s.cache.Set(key, body.Email, time.Minute*15)

	url := s.service.getEmailVerifyUrl(code)

	_, err = s.tasks.CreateAndEnqueue(tasks.TypeVerifyEmailEmail, tasks.VerifyEmailEmailPayload{
		Email: body.Email,
		Url:   url,
	})

	if err != nil {
		return api.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}

// Verify Email godoc
//
//	@Summary		Verify email
//	@Description	Verifies the email of the user
//	@Tags			Auth
//	@Accept			json
//	@Param			code	query	string	true	"Verification code"
//	@Success		200
//	@Failure		400	{object}	echo.HTTPError	"Invalid or expired verification code"
//	@Failure		500	{object}	echo.HTTPError	"Internal Server Error"
//	@Router			/auth/verify-email/verify [get]
func (s *handlers) VerifyEmail(c echo.Context) error {
	code := c.QueryParam("code")

	if code == "" {
		return ErrMalformedOrMissingVerifyToken
	}

	key := fmt.Sprintf("verify-email:%s", code)

	if !s.cache.Has(key) {
		return ErrInvalidOrExpiredVerifyCode
	}

	email, err := s.cache.Get(key)

	if err != nil {
		return api.InternalServerError
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

// Send Forgot Password Email godoc
//
//	@Summary		Send forgot password email
//	@Description	Sends a forgot password email to the user
//	@Tags			Auth
//	@Accept			json
//	@Param			body	body	SendForgotPasswordEmailRequestDto	true	"Request body"
//	@Success		200
//	@Failure		400	{object}	echo.HTTPError	"Invalid email"
//	@Failure		404	{object}	echo.HTTPError	"User not found"
//	@Failure		500	{object}	echo.HTTPError	"Internal Server Error"
//	@Router			/auth/forgot-password/send [post]
func (s *handlers) SendForgotPasswordEmail(c echo.Context) error {
	body := c.Get("body").(SendForgotPasswordEmailRequestDto)
	_, err := s.service.getUserByEmail(body.Email)

	if err != nil {
		return utils.HandleDbErr(c, err)
	}

	code, err := random.DigitsString(6)

	if err != nil {
		return api.InternalServerError
	}

	key := fmt.Sprintf("forgot-password:%s", code)
	s.cache.Set(key, body.Email, time.Minute*15)

	_, err = s.tasks.CreateAndEnqueue(tasks.TypeForgotPasswordEmail, tasks.ForgotPasswordEmailPayload{
		Email: body.Email,
		Code:  code,
	})

	if err != nil {
		return api.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}

// Reset Password godoc
//
//	@Summary		Reset password
//	@Description	Resets the password of the user
//	@Tags			Auth
//	@Accept			json
//	@Param			body	body	ResetPasswordRequestDto	true	"Request body"
//	@Success		200
//	@Failure		400	{object}	echo.HTTPError	"Invalid email or code"
//	@Failure		404	{object}	echo.HTTPError	"User not found"
//	@Failure		500	{object}	echo.HTTPError	"Internal Server Error"
//	@Router			/auth/forgot-password/reset [post]
func (s *handlers) ResetPassword(c echo.Context) error {
	body := c.Get("body").(ResetPasswordRequestDto)
	user, err := s.service.getUserByEmail(body.Email)

	if err != nil {
		return ErrInvalidEmail
	}

	key := fmt.Sprintf("forgot-password:%s", body.Code)
	cacheVal, err := s.cache.Get(key)

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

	err = s.cache.Del(key)

	if err != nil {
		return api.InternalServerError
	}

	return c.NoContent(http.StatusOK)
}
