package random

import (
	"crypto/rand"
	"fmt"
	"math/big"
	randv1 "math/rand"
	"strconv"
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

// Generates a unique string from the allowed runes.
// Generated string will have a length of n.
func FromLetters(n int) string {
	if n < 1 {
		return ""
	}

	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[randv1.Intn(len(letterRunes))]
	}

	return string(b)
}

// Generate n random bytes
func Bytes(n uint32) ([]byte, error) {
	if n < 1 {
		return nil, ErrInvalidBytesCount
	}

	arr := make([]byte, n)
	_, err := rand.Read(arr)

	if err != nil {
		return nil, err
	}

	return arr, nil
}

// Generate a string with n digits
func DigitsString(n int) (string, error) {
	if n < 1 || n > 8 {
		return "", ErrInvalidDigitsCount
	}

	max := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(n)), nil)
	num, err := rand.Int(rand.Reader, max)

	if err != nil {
		return "", err
	}

	fmtStr := "%0" + strconv.Itoa(n) + "d"
	s := fmt.Sprintf(fmtStr, num)

	return s, nil
}
