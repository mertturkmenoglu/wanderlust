package tests_test

import (
	"testing"
	"wanderlust/pkg/dto"

	"resty.dev/v3"
)

func TestAuthE2E(t *testing.T) {
	client := resty.New()
	defer client.Close()

	client.SetBaseURL("http://localhost:6009")
	res, err := client.R().
		SetBody(dto.RegisterInputBody{
			FullName: "Test 1",
			Email:    "test@test.com",
			Password: "testtest",
			Username: "test",
		}).
		SetResult(&dto.RegisterOutputBody{}).
		Post("/api/v2/auth/credentials/register")

	if err != nil {
		t.Errorf("Failed to register user: %v", err)
	}

	if res.StatusCode() != 201 {
		t.Error("Expected status code 201, got " + res.Status())
	}

	body := res.Result().(*dto.RegisterOutputBody)

	if body.Email != "test@test.com" {
		t.Error("Expected email to be test@test.com, got " + body.Email)
	}
}
