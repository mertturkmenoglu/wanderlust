package cookies

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func DeleteSessionCookie(c echo.Context) {
	cookie := new(http.Cookie)
	cookie.Name = "__wanderlust_auth"
	cookie.Value = ""
	cookie.Path = "/"
	cookie.Expires = time.Unix(0, 0)
	cookie.MaxAge = -1
	c.SetCookie(cookie)
}
