package random

import (
	"errors"
	"strconv"
	"testing"
)

const (
	errFmtStr    = "Expected %v, got %v"
	errErrFmtStr = "Expected error, got %v"
	errExpErr    = "Expected error, got nil"
)

func TestFromLettersNegativeInput(t *testing.T) {
	input := -1
	expected := ""
	actual := FromLetters(input)

	if actual != expected {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestFromLettersZeroInput(t *testing.T) {
	input := 0
	expected := ""
	actual := FromLetters(input)

	if actual != expected {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestTableFromLettersPositiveInput(t *testing.T) {
	for i := 1; i < 10; i++ {
		expected := i
		actual := len(FromLetters(i))
		name := "FromLetters(" + strconv.Itoa(i) + ")"

		t.Run(name, func(t *testing.T) {
			if actual != expected {
				t.Errorf(errFmtStr, expected, actual)
			}
		})
	}
}

func TestBytesZeroInput(t *testing.T) {
	var input uint32 = 0
	expected := ErrInvalidBytesCount
	_, actual := Bytes(input)

	if actual == nil {
		t.Errorf(errErrFmtStr, actual)
	}

	if !errors.Is(actual, expected) {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestBytesPositiveInput(t *testing.T) {
	for i := 1; i < 10; i++ {
		expected := i
		name := "Bytes(" + strconv.Itoa(i) + ")"

		t.Run(name, func(t *testing.T) {
			res, err := Bytes(uint32(i))
			actual := len(res)

			if err != nil {
				t.Errorf("Expected nil, got err: %v", err)
			}

			if expected != actual {
				t.Errorf(errFmtStr, expected, actual)
			}
		})
	}
}

func TestDigitsStringNegativeInput(t *testing.T) {
	input := -1
	expected := ErrInvalidDigitsCount
	_, actual := DigitsString(input)

	if actual == nil {
		t.Error(errExpErr)
		return
	}

	if !errors.Is(actual, expected) {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestDigitsStringZeroInput(t *testing.T) {
	input := 0
	expected := ErrInvalidDigitsCount
	_, actual := DigitsString(input)

	if actual == nil {
		t.Error(errExpErr)
		return
	}

	if !errors.Is(actual, expected) {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestDigitsStringInRangeInputs(t *testing.T) {
	for i := 1; i < 8; i++ {
		expected := i
		name := "DigitsString(" + strconv.Itoa(i) + ")"

		t.Run(name, func(t *testing.T) {
			res, err := DigitsString(i)
			actual := len(res)

			if err != nil {
				t.Errorf("Expected nil, got err: %v", err)
				return
			}

			if expected != actual {
				t.Error(res)
				t.Errorf(errFmtStr, expected, actual)
			}
		})
	}
}

func TestDigitsStringGreaterThanMaxValueInput(t *testing.T) {
	input := 9
	expected := ErrInvalidDigitsCount
	_, actual := DigitsString(input)

	if actual == nil {
		t.Error(errExpErr)
		return
	}

	if !errors.Is(actual, expected) {
		t.Errorf(errFmtStr, expected, actual)
	}
}
