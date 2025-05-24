package main

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/hash"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
)

func handleUsers(count int) error {
	logger.Trace("handling users. generating", logger.Args("count", count))
	prefix := "https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/"

	var imageNames = []string{
		"5F9jdqG.jpeg",
		"PLOjI55.jpeg",
		"JYnxkQM.jpeg",
		"Y3ujIqE.jpeg",
		"7oSGh9R.jpeg",
		"Q4xKlfx.jpeg",
		"8VXj0Pt.jpeg",
		"pb24GMQ.jpeg",
		"nOtUKhM.jpeg",
		"f6VKpRj.jpeg",
		"EwvUEmR.jpeg",
		"DOgJY3o.jpeg",
		"mrAicIB.jpeg",
		"wGD07jx.jpeg",
		"1mn0i08.jpeg",
		"sc4r21z.jpeg",
		"0fsRZC9.jpeg",
		"Ivsxi5b.jpeg",
		"opsngDD.jpeg",
		"FKlIkC5.jpeg",
		"2XI5t0u.jpeg",
		"XFG5Q7R.jpeg",
		"H6F5qND.jpeg",
		"OlOa85q.jpeg",
		"nX7JSRq.jpeg",
		"Bpj7Rlw.jpeg",
		"0hYMpwI.jpeg",
		"CNtFbZT.jpeg",
		"SnP70MO.jpeg",
		"mWzmPRv.jpeg",
	}

	ctx := context.Background()
	d := GetDb()
	h, err := hash.Hash("LoremIpsum!1")

	if err != nil {
		return err
	}

	step := 1000

	if count < step {
		step = count
	}

	for i := 0; i < count; i += step {
		if i%step == 0 {
			logger.Trace("Inserting users", logger.Args("index", i))
		}
		if i+step >= count {
			step = count - i
		}

		arg := make([]db.BatchCreateUsersParams, 0, step)

		for range step {
			arg = append(arg, db.BatchCreateUsersParams{
				ID:                    gofakeit.UUID(),
				Email:                 gofakeit.LetterN(4) + gofakeit.Email(),
				Username:              gofakeit.Username() + gofakeit.LetterN(3),
				FullName:              gofakeit.Name(),
				PasswordHash:          pgtype.Text{String: h, Valid: true},
				GoogleID:              pgtype.Text{Valid: false},
				FbID:                  pgtype.Text{Valid: false},
				IsOnboardingCompleted: true,
				IsEmailVerified:       true,
				ProfileImage:          pgtype.Text{String: prefix + gofakeit.RandomString(imageNames), Valid: true},
			})
		}

		_, err := d.Queries.BatchCreateUsers(ctx, arg)

		if err != nil {
			return err
		}
	}

	return nil
}
