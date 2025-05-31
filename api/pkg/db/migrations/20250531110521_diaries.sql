-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS diaries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title VARCHAR(256) NOT NULL,
  description VARCHAR(4096) NOT NULL,
  share_with_friends BOOLEAN NOT NULL DEFAULT false,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT 
    fk_diaries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_diaries_date ON diaries(date);
CREATE INDEX IF NOT EXISTS idx_diaries_user ON diaries(user_id);

CREATE TABLE IF NOT EXISTS diary_pois (
  diary_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  description VARCHAR(256),
  index INT NOT NULL CHECK(index >= 0),
  PRIMARY KEY (diary_id, poi_id),
  CONSTRAINT 
    fk_diary_pois_diary FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_diary_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_diary_pois_unique UNIQUE (diary_id, index)
);

CREATE TABLE IF NOT EXISTS diary_users (
  diary_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),
  PRIMARY KEY (diary_id, user_id),
  CONSTRAINT 
    fk_diary_users_diary FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_diary_users_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_diary_users_unique UNIQUE (diary_id, index)
);

CREATE TABLE IF NOT EXISTS diary_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  diary_id TEXT NOT NULL,
  url VARCHAR(256) NOT NULL,
  index SMALLINT NOT NULL CHECK(index >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT 
    fk_diary_images_diary FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_diary_images_diary ON diary_images(diary_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS diary_images;

DROP TABLE IF EXISTS diary_users;

DROP TABLE IF EXISTS diary_pois;

DROP TABLE IF EXISTS diaries;
-- +goose StatementEnd
