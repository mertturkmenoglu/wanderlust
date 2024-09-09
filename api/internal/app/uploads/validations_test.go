package uploads

import (
	"testing"

	"github.com/google/uuid"
)

const errValidationsFmtStr = "Expected %v, got %v"

func TestIsAllowedUploadTypeShouldReturnTrueForValidUploadTypes(t *testing.T) {
	inputs := allowedUploadTypes

	for _, input := range inputs {
		expected := true
		actual := isAllowedUploadType(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedUploadTypeShouldReturnFalseForInvalidUploadTypes(t *testing.T) {
	invalidUploadTypes := make([]string, 100)

	for i := 0; i < 100; i++ {
		invalidUploadTypes[i] = uuid.New().String()
	}

	for _, input := range invalidUploadTypes {
		expected := false
		actual := isAllowedUploadType(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedMimeTypeShouldReturnTrueForValidMimeTypes(t *testing.T) {
	inputs := allowedMimeTypes

	for _, input := range inputs {
		expected := true
		actual := isAllowedMimeType(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedMimeTypeShouldReturnFalseForInvalidMimeTypes(t *testing.T) {
	invalidMimeTypes := make([]string, 100)

	for i := 0; i < 100; i++ {
		invalidMimeTypes[i] = uuid.New().String()
	}

	for _, input := range invalidMimeTypes {
		expected := false
		actual := isAllowedMimeType(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedCountShouldReturnTrueForValidCounts(t *testing.T) {
	for i := 1; i < 4; i++ {
		expected := true
		actual := isAllowedCount(i)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedCountShouldReturnFalseForInvalidCounts(t *testing.T) {
	invalidCounts := []int{-1, 0, 5, 100}

	for _, input := range invalidCounts {
		expected := false
		actual := isAllowedCount(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}