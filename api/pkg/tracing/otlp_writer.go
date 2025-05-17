package tracing

import (
	"bytes"
	"fmt"
	"net/http"
	"wanderlust/pkg/cfg"
)

type OtlpWriter struct {
	endpoint string
	headers  map[string]string
}

func (w *OtlpWriter) Write(p []byte) (n int, err error) {
	req, err := http.NewRequest("POST", w.endpoint, bytes.NewBuffer(p))
	if err != nil {
		return 0, err
	}

	for k, v := range w.headers {
		req.Header.Set(k, v)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return 0, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return len(p), nil
}

func (w *OtlpWriter) Sync() error {
	return nil
}

func NewOtlpWriter() *OtlpWriter {
	return &OtlpWriter{
		endpoint: cfg.Env.OtlpWriterEndpoint,
		headers: map[string]string{
			"Content-Type":  "application/json",
			"Authorization": "Basic " + cfg.Env.OtlpAuthToken,
		},
	}
}
