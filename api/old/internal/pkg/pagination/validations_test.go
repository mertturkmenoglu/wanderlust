package pagination

import (
	"math/rand/v2"
	"testing"
)

const errValidationsFmtStr = "Expected %v, got %v"

func TestNonPositivePageNumbersShouldReturnFalse(t *testing.T) {
	inputs := []int{-1, 0}

	for _, input := range inputs {
		expected := false
		actual := isValidPage(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestPositivePageNumberShouldReturnTrue(t *testing.T) {
	for i := 1; i < 10; i++ {
		v := rand.Int32()
		expected := true
		actual := isValidPage(int(v))

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestNonPositiveSizeNumberShouldReturnFalse(t *testing.T) {
	inputs := []int{-1, 0}

	for _, input := range inputs {
		expected := false
		actual := isValidSize(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestSizeNumberGreaterThan100ShouldReturnFalse(t *testing.T) {
	v := rand.Int32() + 100
	expected := false
	actual := isValidSize(int(v))

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestSizeNumberInRangeAndDivisibleBy25ShouldReturnTrue(t *testing.T) {
	inputs := []int{25, 50, 75, 100}

	for _, input := range inputs {
		expected := true
		actual := isValidSize(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestSizeNumberInRangeAndDivisibleBy10ShouldReturnTrue(t *testing.T) {
	inputs := []int{10, 20, 30, 40, 50, 60, 70, 80, 90, 100}

	for _, input := range inputs {
		expected := true
		actual := isValidSize(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestSizeNumberInRangeAndNotDivisibleByEither25Or10ShouldReturnFalse(t *testing.T) {
	for i := 1; i < 100; i++ {
		if i%25 == 0 || i%10 == 0 {
			continue
		}

		expected := false
		actual := isValidSize(i)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}
