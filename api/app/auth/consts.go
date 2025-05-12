package auth

const (
	SESSION_NAME         = "__wanderlust_auth"                                                                 // SESSION_NAME is the name of the session cookie.
	GOOGLE_USER_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo"                                     // GOOGLE_USER_ENDPOINT is the endpoint to fetch user information from Google.
	FB_USER_ENDPOINT     = "https://graph.facebook.com/me?fields=id,name,email,picture.width(800).height(800)" // FB_USER_ENDPOINT is the endpoint to fetch user information from Facebook.
)
