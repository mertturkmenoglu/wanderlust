package diary

import "testing"

func TestEmptyArrayShouldReturnZeroZero(t *testing.T) {
	input := make([]Coordinate, 0)
	expected := Coordinate{0, 0}
	actual := GetCenterPoint(input)

	if actual != expected {
		t.Errorf("Expected %v, got %v", expected, actual)
	}
}

func TestOneElementArrayShouldReturnItself(t *testing.T) {
	input := []Coordinate{
		{
			Lat:  42,
			Long: 20,
		},
	}

	expected := input[0]
	actual := GetCenterPoint(input)

	if actual != expected {
		t.Errorf("Expected %v, got %v", expected, actual)
	}
}
