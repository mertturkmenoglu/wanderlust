package logs

import "github.com/pterm/pterm"

func NewPTermLogger() *pterm.Logger {
	return pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)
}
