package utils

import (
	"errors"
	"math"
)

func SafeInt64ToInt32(i int64) (int32, error) {
	if i < math.MinInt32 || i > math.MaxInt32 {
		return 0, errors.New("int64 value overflows int32")
	}

	return int32(i), nil
}

func SafeInt32ToUInt64(i int32) (uint64, error) {
	if i < 0 {
		return 0, errors.New("cannot convert negative int32 to uint64")
	}

	return uint64(i), nil
}

func SafeInt32ToInt16(i int32) (int16, error) {
	if i < math.MinInt16 || i > math.MaxInt16 {
		return 0, errors.New("int32 value overflows int16")
	}

	return int16(i), nil
}

func SafeInt16ToInt8(i int16) (int8, error) {
	if i < math.MinInt8 || i > math.MaxInt8 {
		return 0, errors.New("int16 value overflows int8")
	}

	return int8(i), nil
}

func SafeInt64ToInt16(i int64) (int16, error) {
	if i < math.MinInt16 || i > math.MaxInt16 {
		return 0, errors.New("int64 value overflows int16")
	}

	return int16(i), nil
}
