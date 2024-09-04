package auth

import (
	"strings"
	"testing"
)

const errValidationsFmtStr = "Expected %v, got %v"

func TestEmptyStringShouldBeInvalidUsername(t *testing.T) {
	input := ""
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestLessThan4CharsShouldBeInvalidUsername(t *testing.T) {
	inputs := []string{
		"",
		"a",
		"ab",
		"abc",
	}

	for _, input := range inputs {
		expected := false
		actual := isValidUsername(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestStringJohnDoeShouldBeValidUsername(t *testing.T) {
	input := "johndoe"
	expected := true
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestStringJohn123DoeShouldBeValidUsername(t *testing.T) {
	input := "john123doe"
	expected := true
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestLongerThan32CharsShouldBeInvalidUsername(t *testing.T) {
	str32Len := strings.Repeat("a", 33)
	input := str32Len
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestStringContainingSpaceCharShouldBeInvalidUsername(t *testing.T) {
	input := "john doe"
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestStringContainingUnicodeCharShouldBeInvalidUsername(t *testing.T) {
	input := "john\u00A0doe"
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestOnlyNumberStringShouldBeInvalidUsername(t *testing.T) {
	inputs := []string{
		"123",
		"1234",
		"12345",
		"123456",
		"1234567",
		"12345678",
		"123456789",
	}

	for _, input := range inputs {
		expected := false
		actual := isValidUsername(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestOnlyUnderscoresStringShouldBeInvalidUsername(t *testing.T) {
	strUnderscores := strings.Repeat("_", 16)
	input := strUnderscores
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestStringContainsConsecutiveUnderscoresShouldBeInvalidUsername(t *testing.T) {
	input := "john__doe"
	expected := false
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestStringContainsNotConsecutiveButMultipleUnderscoresShouldBeValidUsername(t *testing.T) {
	input := "john_doe_123"
	expected := true
	actual := isValidUsername(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestIsNumberRuneShouldReturnTrue(t *testing.T) {
	inputs := []rune{
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
	}

	for _, input := range inputs {
		expected := true
		actual := isNumberRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsNumberRuneShouldReturnFalse(t *testing.T) {
	inputs := []rune{
		'a',
		'b',
	}

	for _, input := range inputs {
		expected := false
		actual := isNumberRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsLetterRuneShouldReturnTrue(t *testing.T) {
	inputs := []rune{
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
	}

	for _, input := range inputs {
		expected := true
		actual := isLetterRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsLetterRuneShouldReturnFalse(t *testing.T) {
	inputs := []rune{
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'_',
	}

	for _, input := range inputs {
		expected := false
		actual := isLetterRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsUnderscoreRuneShouldReturnTrue(t *testing.T) {
	input := '_'
	expected := true
	actual := isUnderscoreRune(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestIsUnderscoreRuneShouldReturnFalse(t *testing.T) {
	input := 'A'
	expected := false
	actual := isUnderscoreRune(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestIsAllowedRuneShouldReturnTrue(t *testing.T) {
	inputs := []rune{
		'0',
		'A',
		'a',
		'Z',
		'z',
		'_',
	}

	for _, input := range inputs {
		expected := true
		actual := isAllowedRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsAllowedRuneShouldReturnFalse(t *testing.T) {
	inputs := []rune{
		'!',
		'@',
		'#',
		'$',
		'%',
		'^',
		'&',
		'*',
		'(',
		')',
		'-',
		'+',
		'=',
		'[',
		']',
		'{',
		'}',
		'|',
		'\\',
		'/',
		':',
		';',
		',',
		'.',
		'<',
		'>',
		'?',
		'~',
		'`',
		'!',
		'"',
		'\'',
		'\t',
		'\n',
		'\r',
		'\f',
		'\v',
	}

	for _, input := range inputs {
		expected := false
		actual := isAllowedRune(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsOnlyNumberStringShouldReturnTrue(t *testing.T) {
	inputs := []string{
		"123",
		"1234",
		"12345",
		"123456",
		"1234567",
		"12345678",
		"123456789",
	}

	for _, input := range inputs {
		expected := true
		actual := isOnlyNumberString(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsOnlyNumberStringShouldReturnFalse(t *testing.T) {
	inputs := []string{
		"abc",
		"abc123",
		"123abc",
		"123abc456",
		"abc123def",
		"abc123def456",
	}

	for _, input := range inputs {
		expected := false
		actual := isOnlyNumberString(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}

func TestIsOnlyUnderscoresStringShouldReturnTrue(t *testing.T) {
	strUnderscores := strings.Repeat("_", 16)
	input := strUnderscores
	expected := true
	actual := isOnlyUnderscoresString(input)

	if actual != expected {
		t.Errorf(errValidationsFmtStr, expected, actual)
	}
}

func TestIsOnlyUnderscoresStringShouldReturnFalse(t *testing.T) {
	inputs := []string{
		"abc",
		"abc123",
		"123abc",
		"123abc456",
		"abc123def",
		"abc123def456",
	}

	for _, input := range inputs {
		expected := false
		actual := isOnlyUnderscoresString(input)

		if actual != expected {
			t.Errorf(errValidationsFmtStr, expected, actual)
		}
	}
}
