package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"github.com/davecgh/go-spew/spew"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func PTermLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		logger := pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)
		logger.TimeFormat = time.TimeOnly
		req := c.Request()
		res := c.Response()
		start := time.Now()
		err := next(c)

		if err != nil {
			spew.Dump(err)
			c.Error(err)
		}

		stop := time.Now()
		method := getMethodWithColor(req.Method)
		path := c.Path()
		status := getStatusWithColor(res.Status)
		latencyHumanReadable := stop.Sub(start).String()

		params := make(map[string]string, 0)
		qparams := make(map[string][]string, 0)

		for q := range c.QueryParams() {
			qparams[q] = c.QueryParams()[q]
		}

		for _, name := range c.ParamNames() {
			params[name] = c.Param(name)
		}

		args := logger.Args(
			"method", method,
			"status", status,
			"path", path,
			"latency", latencyHumanReadable,
			"params", params,
			"queryParams", qparams,
		)

		if res.Status >= 500 {
			spew.Dump(err)
			logger.Error("Server Error", args)
		} else if res.Status >= 400 {
			spew.Dump(err)
			logger.Error("Request Error", args)
		} else {
			logger.Info("Request", args)
		}

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
