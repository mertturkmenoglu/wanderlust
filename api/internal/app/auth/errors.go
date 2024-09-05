package auth

import (
	"errors"
	"wanderlust/internal/app/api"
)

// errPasswordDontMatch                 = errors.New("current password doesn't match")
// errPasswordTooWeak                   = errors.New("password is too weak")
// errPrevLinkNotExpired                = errors.New("previous link hasn't expired")
// errInvalidCode                       = errors.New("invalid code")
// errPrevCodeNotExpired                = errors.New("previous code hasn't expired")

var (
	ErrSessionGet                        = api.NewApiError("0001", errors.New("failed to get session"))
	ErrCreateOAuthState                  = api.NewApiError("0002", errors.New("cannot create oauth state parameter"))
	ErrInvalidProvider                   = api.NewApiError("0003", errors.New("invalid oauth provider"))
	ErrInvalidSessionState               = api.NewApiError("0004", errors.New("invalid session state"))
	ErrInvalidStateParameter             = api.NewApiError("0005", errors.New("invalid state parameter"))
	ErrOAuthTokenExchange                = api.NewApiError("0006", errors.New("failed to exchange token"))
	ErrOAuthFailedUserFetch              = api.NewApiError("0007", errors.New("failed to fetch user"))
	ErrOAuthInvalidUserResp              = api.NewApiError("0008", errors.New("failed to parse user"))
	ErrInvalidEmailOrPassword            = api.NewApiError("0009", errors.New("invalid email or password"))
	ErrEmailTaken                        = api.NewApiError("0010", errors.New("email has already been taken"))
	ErrUsernameTaken                     = api.NewApiError("0011", errors.New("username has already been taken"))
	ErrUsernameChars                     = api.NewApiError("0012", errors.New("username must include only alphanumeric characters or underscore"))
	ErrHash                              = api.NewApiError("0013", errors.New("cannot hash"))
	ErrInvalidEmail                      = api.NewApiError("0014", errors.New("invalid email"))
	ErrEmailAlreadyVerified              = api.NewApiError("0015", errors.New("email has already been verified"))
	ErrMalformedOrMissingVerifyToken     = api.NewApiError("0016", errors.New("verification token is missing or malformed"))
	ErrInvalidOrExpiredVerifyCode        = api.NewApiError("0017", errors.New("verification code is invalid or expired"))
	ErrPasswordResetCodeExpiredOrInvalid = api.NewApiError("0018", errors.New("password reset code is invalid or expired"))
)
