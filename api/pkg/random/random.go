package random

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"strconv"
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var base62Runes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

// Generates a unique string from the allowed runes.
// Generated string will have a length of n.
func FromLetters(n int) string {
	if n < 1 {
		return ""
	}

	b := make([]rune, n)
	for i := range b {
		x, err := rand.Int(rand.Reader, big.NewInt(int64(len(letterRunes))))

		if err != nil {
			panic("cannot generate random number: " + err.Error())
		}

		b[i] = letterRunes[x.Int64()]
	}

	return string(b)
}

func FromBase62(n int) string {
	if n < 1 {
		return ""
	}

	b := make([]rune, n)
	for i := range b {
		x, err := rand.Int(rand.Reader, big.NewInt(int64(len(base62Runes))))

		if err != nil {
			panic("cannot generate random number: " + err.Error())
		}

		b[i] = base62Runes[x.Int64()]
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
