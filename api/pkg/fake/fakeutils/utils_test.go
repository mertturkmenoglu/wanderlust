package fakeutils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRandElemEmptyArray(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	arr := []int{}

	_ = RandElem(arr)
}

func TestRandElemArrayWithOneElement(t *testing.T) {
	arr := []int{1}

	actual := RandElem(arr)

	assert.Contains(t, arr, actual, "the element should be in the array")
}

func TestRandElemArrayWithMultipleElements(t *testing.T) {
	arr := []int{1, 2, 3, 4, 5}

	result := RandElem(arr)

	assert.Contains(t, arr, result, "the element should be in the array")
}

func TestRandElemsEmptyArray(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	arr := []int{}

	_ = RandElems(arr, 1)
}

func TestRandElemsArrayWithOneElement(t *testing.T) {
	arr := []int{1}

	expected := 1
	result := RandElems(arr, 1)
	actual := len(result)

	assert.Equal(t, expected, actual, "they should be equal")

	assert.Contains(t, arr, result[0], "the element should be in the array")
}

func TestRandElemsArrayWithMultipleElements(t *testing.T) {
	arr := []int{1, 2, 3, 4, 5}

	var n int32 = 3
	expected := n
	result := RandElems(arr, n)
	actual := int32(len(result))

	assert.Equal(t, expected, actual, "they should be equal")

	for _, el := range result {
		assert.Contains(t, arr, el, "the element should be in the array")
	}
}

func TestRandElemsMoreThanArrayLength(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	arr := []int{1, 2, 3, 4, 5}

	_ = RandElems(arr, 6)
}

func TestRandElemsTakeZero(t *testing.T) {
	arr := []int{1, 2, 3, 4, 5}

	expected := 0
	result := RandElems(arr, 0)
	actual := len(result)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestRandElemsTakeNegative(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	arr := []int{1, 2, 3, 4, 5}

	_ = RandElems(arr, -1)
}

func TestChunkCountExactDivision(t *testing.T) {
	arrlen := 10
	batchSize := 2

	expected := 5
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestChunkCountArraySmallerThanBatch(t *testing.T) {
	arrlen := 10
	batchSize := 20

	expected := 1
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestChunkCountArrayEqualToBatch(t *testing.T) {
	arrlen := 10
	batchSize := 10

	expected := 1
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

// TestArrayNotDivisibleByBatch
func TestChunkCountArrayNotDivisibleByBatch(t *testing.T) {
	arrlen := 10
	batchSize := 3

	expected := 4
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

// TestZeroArrayLength
func TestChunkCountZeroArrayLength(t *testing.T) {
	arrlen := 0
	batchSize := 10

	expected := 0
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

// TestZeroBatchSize
func TestChunkCountZeroBatchSize(t *testing.T) {
	arrlen := 10
	batchSize := 0

	expected := 0
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestChunkCountNegativeBatchSize(t *testing.T) {
	arrlen := 10
	batchSize := -1

	actual := GetChunkCount(arrlen, batchSize)
	expected := 0

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestChunkCountLargeArrayAndBatchSize(t *testing.T) {
	arrlen := 100
	batchSize := 10

	expected := 10
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestChunkCountBatchSizeOne(t *testing.T) {
	arrlen := 10
	batchSize := 1

	expected := 10
	actual := GetChunkCount(arrlen, batchSize)

	assert.Equal(t, expected, actual, "they should be equal")
}
