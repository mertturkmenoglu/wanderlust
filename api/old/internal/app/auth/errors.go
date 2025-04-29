package auth

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

// errPasswordDontMatch                 = errors.New("current password doesn't match")
// errPasswordTooWeak                   = errors.New("password is too weak")
// errPrevLinkNotExpired                = errors.New("previous link hasn't expired")
// errInvalidCode                       = errors.New("invalid code")
// errPrevCodeNotExpired                = errors.New("previous code hasn't expired")

var (
	ErrSessionGet                        = errs.NewApiError(http.StatusInternalServerError, "0001", errors.New("failed to get session"))
	ErrCreateOAuthState                  = errs.NewApiError(http.StatusInternalServerError, "0002", errors.New("cannot create oauth state parameter"))
	ErrInvalidProvider                   = errs.NewApiError(http.StatusBadRequest, "0003", errors.New("invalid oauth provider"))
	ErrInvalidSessionState               = errs.NewApiError(http.StatusBadRequest, "0004", errors.New("invalid session state"))
	ErrInvalidStateParameter             = errs.NewApiError(http.StatusBadRequest, "0005", errors.New("invalid state parameter"))
	ErrOAuthTokenExchange                = errs.NewApiError(http.StatusInternalServerError, "0006", errors.New("failed to exchange token"))
	ErrOAuthFailedUserFetch              = errs.NewApiError(http.StatusInternalServerError, "0007", errors.New("failed to fetch user"))
	ErrOAuthInvalidUserResp              = errs.NewApiError(http.StatusInternalServerError, "0008", errors.New("failed to parse user"))
	ErrInvalidEmailOrPassword            = errs.NewApiError(http.StatusBadRequest, "0009", errors.New("invalid email or password"))
	ErrEmailTaken                        = errs.NewApiError(http.StatusUnprocessableEntity, "0010", errors.New("email has already been taken"))
	ErrUsernameTaken                     = errs.NewApiError(http.StatusUnprocessableEntity, "0011", errors.New("username has already been taken"))
	ErrUsernameChars                     = errs.NewApiError(http.StatusUnprocessableEntity, "0012", errors.New("username must include only alphanumeric characters or underscore"))
	ErrHash                              = errs.NewApiError(http.StatusInternalServerError, "0013", errors.New("cannot hash"))
	ErrInvalidEmail                      = errs.NewApiError(http.StatusUnprocessableEntity, "0014", errors.New("invalid email"))
	ErrEmailAlreadyVerified              = errs.NewApiError(http.StatusUnprocessableEntity, "0015", errors.New("email has already been verified"))
	ErrMalformedOrMissingVerifyToken     = errs.NewApiError(http.StatusBadRequest, "0016", errors.New("verification token is missing or malformed"))
	ErrInvalidOrExpiredVerifyCode        = errs.NewApiError(http.StatusUnprocessableEntity, "0017", errors.New("verification code is invalid or expired"))
	ErrPasswordResetCodeExpiredOrInvalid = errs.NewApiError(http.StatusUnprocessableEntity, "0018", errors.New("password reset code is invalid or expired"))
)
