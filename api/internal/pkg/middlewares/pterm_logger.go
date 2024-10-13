package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func PTermLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)
		req := c.Request()
		res := c.Response()
		start := time.Now()
		err := next(c)

		if err != nil {
			c.Error(err)
		}

		stop := time.Now()
		method := getMethodWithColor(req.Method)
		uri := req.RequestURI
		status := getStatusWithColor(res.Status)
		latencyHumanReadable := stop.Sub(start).String()

		msg := fmt.Sprintf("%s %s %s %s", method, uri, status, latencyHumanReadable)
		logger.Info(msg)

		return err
	}
}

func getMethodWithColor(m string) string {
	tmp := fmt.Sprintf("[%s]", m)
	if m == http.MethodGet {
		return pterm.Green(tmp)
	} else if m == http.MethodPost {
		return pterm.Yellow(tmp)
	} else if m == http.MethodPut {
		return pterm.Cyan(tmp)
	} else if m == http.MethodPatch {
		return pterm.Magenta(tmp)
	} else if m == http.MethodDelete {
		return pterm.Red(tmp)
	} else if m == http.MethodHead {
		return pterm.LightGreen(tmp)
	} else if m == http.MethodOptions {
		return pterm.Blue(tmp)
	} else {
		return pterm.Gray(tmp)
	}
}

func getStatusWithColor(s int) string {
	tmp := fmt.Sprintf("(%d)", s)

	if s >= 500 {
		return pterm.Red(tmp)
	} else if s >= 400 {
		return pterm.Yellow(tmp)
	} else if s >= 300 {
		return pterm.Cyan(tmp)
	} else if s >= 200 {
		return pterm.Green(tmp)
	} else {
		return tmp
	}
}
