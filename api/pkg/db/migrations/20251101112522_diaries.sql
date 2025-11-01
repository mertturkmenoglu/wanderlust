-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS diaries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  title VARCHAR(256) NOT NULL,
  description VARCHAR(4096),
  share_with_friends BOOLEAN NOT NULL DEFAULT false,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  date_range daterange GENERATED ALWAYS AS (daterange(start_date, end_date, '[]')) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT 
    fk_diaries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_diaries_date_range ON diaries USING GIST(date_range);
CREATE INDEX IF NOT EXISTS idx_diaries_user ON diaries(user_id);

CREATE TABLE IF NOT EXISTS diary_places (
  diary_id TEXT NOT NULL,
  place_id TEXT NOT NULL,

  description VARCHAR(256),
  index INT NOT NULL CHECK(index >= 0),
  visit_date DATE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (diary_id, place_id),
  CONSTRAINT
    fk_diary_places_diary FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_diary_places_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_diary_places_unique UNIQUE (diary_id, index)
);

CREATE TABLE IF NOT EXISTS diary_mentions (
  diary_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),

  PRIMARY KEY (diary_id, user_id),
  CONSTRAINT 
    fk_diary_mentions_diary FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_diary_mentions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_diary_mentions_unique UNIQUE (diary_id, index)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS diary_mentions;

DROP TABLE IF EXISTS diary_places;

DROP TABLE IF EXISTS diaries;
-- +goose StatementEnd
