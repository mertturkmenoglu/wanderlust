package oauth

import (
	"context"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"golang.org/x/oauth2"
)

type User struct {
	Provider string
	ID       string
	Email    string
	Name     string
	Picture  string
}

// FetchUserInfo retrieves user information from the OAuth provider using the provided token.
// Sends a request to the provider's user info endpoint and parses the response.
// Returns a User struct populated with the retrieved data.
func FetchUserInfo(ctx context.Context, provider string, token *oauth2.Token) (*User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	providerInstance := GetProviderInstance(provider)
	cfg := providerInstance.GetConfig()
	client := cfg.Client(ctx, token)
	endpoint := providerInstance.GetUserInfoEndpoint()

	res, err := client.Get(endpoint)

	if err != nil {
		return nil, errors.Wrap(ErrFetchUserInfo, err.Error())
	}

	defer res.Body.Close()

	err = providerInstance.ParseUserInfo(res.Body)

	if err != nil {
		return nil, errors.Wrap(ErrFetchUserInfo, err.Error())
	}

	return providerInstance.ToUser(), nil
}
