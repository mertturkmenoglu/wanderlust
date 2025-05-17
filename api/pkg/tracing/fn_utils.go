package tracing

import (
	"runtime"
	"strings"
)

func GetFnName() string {
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		return "unknown"
	}
	fn := runtime.FuncForPC(pc)
	name := fn.Name()
	parts := strings.Split(name, "/")
	return parts[len(parts)-1]
}
