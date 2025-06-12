package utils

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
)

// max64

// min64

func Test64To32ShouldPassWhenGivenZero(t *testing.T) {
	input := int64(0)
	expected := int32(0)

	actual, err := SafeInt64ToInt32(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To32ShouldPassWhenGivenIsInBoundariesPositiveNumber(t *testing.T) {
	input := int64(24601)
	expected := int32(24601)

	actual, err := SafeInt64ToInt32(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To32ShouldPassWhenGivenIsInBoundariesNegativeNumber(t *testing.T) {
	input := int64(-24601)
	expected := int32(-24601)

	actual, err := SafeInt64ToInt32(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To32ShouldPassWhenGivenIsMaxInt32(t *testing.T) {
	input := int64(math.MaxInt32)
	expected := int32(math.MaxInt32)

	actual, err := SafeInt64ToInt32(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To32ShouldPassWhenGivenIsMinInt32(t *testing.T) {
	input := int64(math.MinInt32)
	expected := int32(math.MinInt32)

	actual, err := SafeInt64ToInt32(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To32ShouldFailWhenGivenIsGreaterThanMaxInt32(t *testing.T) {
	input := int64(math.MaxInt32 + 1)

	_, err := SafeInt64ToInt32(input)

	assert.Error(t, err)
}

func Test64To32ShouldFailWhenGivenIsLessThanMinInt32(t *testing.T) {
	input := int64(math.MinInt32 - 1)

	_, err := SafeInt64ToInt32(input)

	assert.Error(t, err)
}

func Test64To32ShouldFailWhenGivenIsMaxInt64(t *testing.T) {
	input := int64(math.MaxInt64)

	_, err := SafeInt64ToInt32(input)

	assert.Error(t, err)
}

func Test64To32ShouldFailWhenGivenIsMinInt64(t *testing.T) {
	input := int64(math.MinInt64)

	_, err := SafeInt64ToInt32(input)

	assert.Error(t, err)
}

func Test32ToUInt64ShouldPassWhenGivenZero(t *testing.T) {
	input := int32(0)
	expected := uint64(0)

	actual, err := SafeInt32ToUInt64(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test32ToUInt64ShouldPassWhenGivenIsInBoundariesPositiveNumber(t *testing.T) {
	input := int32(24601)
	expected := uint64(24601)

	actual, err := SafeInt32ToUInt64(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test32ToUInt64ShouldFailWhenGivenNegativeNumber(t *testing.T) {
	input := int32(-24601)

	_, err := SafeInt32ToUInt64(input)

	assert.Error(t, err)
}

func Test32ToInt16ShouldPassWhenGivenZero(t *testing.T) {
	input := int32(0)
	expected := int16(0)

	actual, err := SafeInt32ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test32ToInt16ShouldPassWhenGivenIsInBoundariesPositiveNumber(t *testing.T) {
	input := int32(24601)
	expected := int16(24601)

	actual, err := SafeInt32ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test32ToInt16ShouldPassWhenGivenIsInBoundariesNegativeNumber(t *testing.T) {
	input := int32(-24601)
	expected := int16(-24601)

	actual, err := SafeInt32ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test32ToInt16ShouldFailWhenGivenIsGreaterThanMaxInt16(t *testing.T) {
	input := int32(math.MaxInt16 + 1)

	_, err := SafeInt32ToInt16(input)

	assert.Error(t, err)
}

func Test32ToInt16ShouldFailWhenGivenIsLessThanMinInt16(t *testing.T) {
	input := int32(math.MinInt16 - 1)

	_, err := SafeInt32ToInt16(input)

	assert.Error(t, err)
}

func Test16To8ShouldPassWhenGivenZero(t *testing.T) {
	input := int16(0)
	expected := int8(0)

	actual, err := SafeInt16ToInt8(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test16To8ShouldPassWhenGivenIsInBoundariesPositiveNumber(t *testing.T) {
	input := int16(97)
	expected := int8(97)

	actual, err := SafeInt16ToInt8(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test16To8ShouldPassWhenGivenIsInBoundariesNegativeNumber(t *testing.T) {
	input := int16(-97)
	expected := int8(-97)

	actual, err := SafeInt16ToInt8(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test16To8ShouldFailWhenGivenIsGreaterThanMaxInt8(t *testing.T) {
	input := int16(math.MaxInt8 + 1)

	_, err := SafeInt16ToInt8(input)

	assert.Error(t, err)
}

func Test16To8ShouldFailWhenGivenIsLessThanMinInt8(t *testing.T) {
	input := int16(math.MinInt8 - 1)

	_, err := SafeInt16ToInt8(input)

	assert.Error(t, err)
}

func Test64To16ShouldPassWhenGivenZero(t *testing.T) {
	input := int64(0)
	expected := int16(0)

	actual, err := SafeInt64ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To16ShouldPassWhenGivenIsInBoundariesPositiveNumber(t *testing.T) {
	input := int64(97)
	expected := int16(97)

	actual, err := SafeInt64ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To16ShouldPassWhenGivenIsInBoundariesNegativeNumber(t *testing.T) {
	input := int64(-97)
	expected := int16(-97)

	actual, err := SafeInt64ToInt16(input)

	assert.NoError(t, err)
	assert.Equal(t, expected, actual)
}

func Test64To16ShouldFailWhenGivenIsGreaterThanMaxInt16(t *testing.T) {
	input := int64(math.MaxInt16 + 1)

	_, err := SafeInt64ToInt16(input)

	assert.Error(t, err)
}

func Test64To16ShouldFailWhenGivenIsLessThanMinInt16(t *testing.T) {
	input := int64(math.MinInt16 - 1)

	_, err := SafeInt64ToInt16(input)

	assert.Error(t, err)
}
