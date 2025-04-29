package hash

import (
	"bytes"
	"encoding/base64"
	"testing"
	"wanderlust/internal/pkg/random"
)

var (
	hardcodedPassword = "password"
	hardcodedHash     = "$argon2id$v=19$m=65536,t=3,p=2$gB7Jqq8pm5Ldk+upwF7b7g$V9wByXDW6wTId0NE1adVFDTHNRfnQTdODK0O+jdIUh8"
	hardcodedHashPart = "V9wByXDW6wTId0NE1adVFDTHNRfnQTdODK0O+jdIUh8"
	hardcodedSaltPart = "gB7Jqq8pm5Ldk+upwF7b7g"
	errFmtStr         = "Expected %v, got %v"
)

func TestShouldHashAndVerifyRandomPassword(t *testing.T) {
	expected := true
	randomPassword := random.FromLetters(10)
	hashed, err := Hash(randomPassword)

	if err != nil {
		t.Errorf("Error hashing password: %v", err)
	}

	actual, err := Verify(randomPassword, hashed)

	if err != nil {
		t.Errorf("Error verifying password: %v", err)
	}

	if actual != expected {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestShouldVerifyHardcodedPasswordAndHash(t *testing.T) {
	expected := true
	actual, err := Verify(hardcodedPassword, hardcodedHash)

	if err != nil {
		t.Errorf("Error verifying password: %v", err)
	}

	if actual != expected {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestShouldDecodeSaltOfHardcodedHash(t *testing.T) {
	expected, _ := base64.RawStdEncoding.Strict().DecodeString(hardcodedSaltPart)
	actual, _, err := decode(hardcodedHash)

	if err != nil {
		t.Errorf("Error decoding hash: %v", err)
	}

	if !bytes.Equal(expected, actual) {
		t.Errorf(errFmtStr, expected, actual)
	}
}

func TestShouldDecodeHashOfHardcodedHash(t *testing.T) {
	expected, _ := base64.RawStdEncoding.Strict().DecodeString(hardcodedHashPart)
	_, actual, err := decode(hardcodedHash)

	if err != nil {
		t.Errorf("Error decoding hash: %v", err)
	}

	if !bytes.Equal(expected, actual) {
		t.Errorf(errFmtStr, expected, actual)
	}
}
