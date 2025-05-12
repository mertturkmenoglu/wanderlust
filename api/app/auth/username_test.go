package auth

import "testing"

const errFmtStr = "Expected %v, got %v"

func TestEmptyStringShouldReturnEmptyCLeanEmailLocalPart(t *testing.T) {
	input := ""
	expected := ""
	actual := cleanEmailLocalPart(input)

	if actual != expected {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestStringWithInvalidCharactersShouldReturnEmptyCLeanEmailLocalPart(t *testing.T) {
	inputs := []string{
		"#@!",
		"###",
		"!@#$%^&*()",
		"@#$%#@%!@",
		"{}{}",
		",><./?':;\\|",
	}

	for _, input := range inputs {
		expected := ""
		actual := cleanEmailLocalPart(input)

		if actual != expected {
			t.Errorf(errFmtStr, expected, actual)
		}
	}
}

func TestStringWithValidCharactersShouldReturnItselfAsCleanEmailLocalPart(t *testing.T) {
	inputs := []string{
		"johndoe",
		"john123doe",
		"johndoe123",
		"johndoe_123",
		"john_doe_123",
	}

	for _, input := range inputs {
		expected := input
		actual := cleanEmailLocalPart(input)

		if actual != expected {
			t.Errorf(errFmtStr, expected, actual)
		}
	}
}
