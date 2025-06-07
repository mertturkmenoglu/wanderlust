package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/hash"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
)

var userImagePrefix = "https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/"

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

var defaultPassword = "LoremIpsum!1" // #nosec G101 -- This is a test/fake value

type FakeUsers struct {
	Count int
	Step  int
	*Fake
}

func (f *FakeUsers) Generate() (int64, error) {
	h, err := hash.Hash(defaultPassword)

	if err != nil {
		return 0, err
	}

	if f.Count < f.Step {
		f.Step = f.Count
	}

	for i := 0; i < f.Count; i += f.Step {
		if i+f.Step >= f.Count {
			f.Step = f.Count - i
		}

		batch := make([]db.BatchCreateUsersParams, 0, f.Step)

		for range f.Step {
			batch = append(batch, db.BatchCreateUsersParams{
				ID:           gofakeit.UUID(),
				Email:        gofakeit.LetterN(4) + gofakeit.Email(),
				Username:     gofakeit.Username() + gofakeit.LetterN(3),
				FullName:     gofakeit.Name(),
				PasswordHash: pgtype.Text{String: h, Valid: true},
				GoogleID:     pgtype.Text{Valid: false},
				FbID:         pgtype.Text{Valid: false},
				ProfileImage: pgtype.Text{String: userImagePrefix + gofakeit.RandomString(imageNames), Valid: true},
			})
		}

		_, err := f.db.Queries.BatchCreateUsers(context.Background(), batch)

		if err != nil {
			return 0, err
		}
	}

	return int64(f.Count), nil
}
