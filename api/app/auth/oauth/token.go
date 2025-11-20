package oauth

import (
	"context"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"golang.org/x/oauth2"
)

type GetTokenParams struct {
	Provider    string
	State       string
	CookieState string
	Code        string
}

// Do a token exchange with the OAuth provider using the provided code and state.
func GetToken(ctx context.Context, params GetTokenParams) (*oauth2.Token, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	providerInstance := GetProviderInstance(params.Provider)
	cfg := providerInstance.GetConfig()

	if params.State != params.CookieState {
		return nil, ErrInvalidState
	}

	token, err := cfg.Exchange(ctx, params.Code)

	if err != nil {
		return nil, errors.Wrap(ErrTokenExchange, err.Error())
	}

	return token, nil
}
