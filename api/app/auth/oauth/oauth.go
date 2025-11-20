package oauth

import (
	"encoding/base64"
	"wanderlust/pkg/random"

	"golang.org/x/oauth2"
)

func GetStateAndRedirectUrl(provider string) (string, string, error) {
	providerInstance := GetProviderInstance(provider)
	cfg := providerInstance.GetConfig()
	state, err := generateStateString()

	if err != nil {
		return "", "", err
	}

	url := cfg.AuthCodeURL(state, oauth2.ApprovalForce)
	return state, url, nil
}

// state is used for additional OAuth2 security.
// It generates a random string of 16 bytes.
// It then encodes it to base64 URL encoding.
func generateStateString() (string, error) {
	bytes, err := random.Bytes(16)

	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(bytes), nil
}
