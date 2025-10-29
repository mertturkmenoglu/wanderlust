package fault

import (
	"context"
	"fmt"
	"time"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
)

type Fault struct {
	err error
}

func New(err error) *Fault {
	return &Fault{
		err: err,
	}
}

func (f *Fault) Domain(domain errors.Domain) *Fault {
	f.err = errors.WithDomain(f.err, domain)
	return f
}

func (f *Fault) Public(message string) *Fault {
	f.err = errors.WithHint(f.err, message)
	return f
}

func (f *Fault) Internal(message string) *Fault {
	f.err = errors.WithDetail(f.err, fmt.Sprintf("internal: %s", message))
	return f
}

func (f *Fault) Context(ctx context.Context) *Fault {
	f.err = errors.WithContextTags(f.err, ctx)
	return f
}

func (f *Fault) With(err error) *Fault {
	f.err = errors.Wrap(f.err, err.Error())
	return f
}

func (f *Fault) Time() *Fault {
	f.err = errors.WithSafeDetails(f.err, fmt.Sprintf("time: %s", time.Now().Format(time.RFC3339)))
	return f
}

func (f *Fault) Location() *Fault {
	fnName := tracing.GetFnName()
	f.err = errors.WithSafeDetails(f.err, fmt.Sprintf("function: %s", fnName))
	return f
}

func (f *Fault) Get() error {
	return f.err
}
