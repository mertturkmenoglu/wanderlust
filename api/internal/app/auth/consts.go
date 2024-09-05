package auth

const (
	// SESSION_NAME is the name of the session cookie.
	SESSION_NAME = "__wanderlust_auth"
	// GOOGLE_USER_ENDPOINT is the endpoint to fetch user information from Google.
	GOOGLE_USER_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo"
	// FB_USER_ENDPOINT is the endpoint to fetch user information from Facebook.
	FB_USER_ENDPOINT = "https://graph.facebook.com/me?fields=id,name,email,picture.width(800).height(800)"
)
