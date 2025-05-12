// Package hash provides utilites to work with Argon2 hashing
package hash

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"wanderlust/pkg/random"

	"golang.org/x/crypto/argon2"
)

const (
	saltLength  = 16
	memory      = 65536
	iterations  = 3
	parallelism = 2
	keyLength   = 32
)

var (
	ErrInvalidHash         = errors.New("the encoded hash is not in the correct format")
	ErrIncompatibleVersion = errors.New("incompatible version of argon2")
)

// Produces argon2 hash of the given string s.
func Hash(s string) (string, error) {
	salt, err := random.Bytes(saltLength)

	if err != nil {
		return "", err
	}

	hash := argon2.Key([]byte(s), salt, iterations, memory, parallelism, keyLength)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	encodedHash := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		memory,
		iterations,
		parallelism,
		b64Salt,
		b64Hash,
	)

	return encodedHash, nil
}

// Given strings plain and hashed, return true if
// plain's hash is equal to the hashed.
func Verify(plain string, hashed string) (bool, error) {
	salt, hash, err := decode(hashed)

	if err != nil {
		return false, err
	}

	otherHash := argon2.Key([]byte(plain), salt, iterations, memory, parallelism, keyLength)

	if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
		return true, nil
	}

	return false, nil
}

// Decode base64 encoded parts of the hash.
//
// Returns salt used in hashing, hash value, and the error
func decode(s string) ([]byte, []byte, error) {
	parts := strings.Split(s, "$")

	if len(parts) != 6 {
		return nil, nil, ErrInvalidHash
	}

	var version int
	_, err := fmt.Sscanf(parts[2], "v=%d", &version)

	if err != nil {
		return nil, nil, err
	}

	if version != argon2.Version {
		return nil, nil, ErrIncompatibleVersion
	}

	var (
		mem, iter, parallel int
	)
	_, err = fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &mem, &iter, &parallel)

	if err != nil {
		return nil, nil, err
	}

	salt, err := base64.RawStdEncoding.Strict().DecodeString(parts[4])

	if err != nil {
		return nil, nil, err
	}

	hash, err := base64.RawStdEncoding.Strict().DecodeString(parts[5])
	if err != nil {
		return nil, nil, err
	}

	return salt, hash, nil
}
