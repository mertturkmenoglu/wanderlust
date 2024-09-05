package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"wanderlust/internal/db"
	"wanderlust/internal/random"

	"github.com/jackc/pgx/v5"
)

func generateUsernameFromEmail(db *db.Db, email string) (string, error) {
	localPart := strings.Split(email, "@")[0]
	validLocalPart := cleanEmailLocalPart(localPart)

	// Check if a user with validLocalPart username exists
	_, err := db.Queries.GetUserByUsername(context.Background(), validLocalPart)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			// Something else happened. Abort.
			return "", err
		}

		if !isValidUsername(validLocalPart) {
			// Username is not valid
			return "", ErrUsernameChars.Err
		}

		// Username is valid and there is no user
		// with this username.
		// We can use this username.
		return validLocalPart, nil
	}

	// There's already a user with this username.
	// Append random string at the end of validLocalPart.
	var base = validLocalPart

	if len(validLocalPart) > 24 {
		base = validLocalPart[0:24]
	}

	newStr := base + random.FromLetters(8)

	if !isValidUsername(newStr) {
		// Username is not valid
		return "", ErrUsernameChars.Err
	}

	_, err = db.Queries.GetUserByUsername(context.Background(), newStr)

	if err != nil {
		return "", ErrUsernameTaken.Err
	}

	return newStr, nil
}

func cleanEmailLocalPart(localPart string) string {
	var validLocalPart = ""

	for _, r := range localPart {
		if isAllowedRune(r) {
			validLocalPart = fmt.Sprintf("%s%c", validLocalPart, r)
		}
	}

	return validLocalPart
}
