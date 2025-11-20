package oauth

import (
	"io"

	"golang.org/x/oauth2"
)

// Provider defines the interface that OAuth providers must implement.
// It includes methods for obtaining OAuth2 configuration, user information,
// and parsing user data from the provider's API.
type Provider interface {
	// Get the OAuth2 configuration for the provider.
	GetConfig() *oauth2.Config

	// Convert the provider-specific user data to a generic User struct.
	ToUser() *User

	// Get the endpoint URL for fetching user information.
	GetUserInfoEndpoint() string

	// Parse the user information returned by the provider's API.
	ParseUserInfo(data io.ReadCloser) error
}

// Define all supported OAuth providers here.
var providerInstances = map[string]Provider{
	"google":   &GoogleProvider{},
	"facebook": &FacebookProvider{},
}

// A handy function to get a provider instance by name.
func GetProviderInstance(name string) Provider {
	return providerInstances[name]
}
