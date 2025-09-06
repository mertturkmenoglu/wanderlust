-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR (128) UNIQUE NOT NULL,
  username VARCHAR (32) UNIQUE NOT NULL,
  full_name VARCHAR (128) NOT NULL,
  password_hash VARCHAR (256),
  google_id VARCHAR(64) UNIQUE,
  fb_id VARCHAR(64) UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  bio VARCHAR(256),
  pronouns VARCHAR(32),
  website VARCHAR(256),
  profile_image VARCHAR(256),
  banner_image VARCHAR(256),
  followers_count INT DEFAULT 0 NOT NULL,
  following_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

CREATE INDEX IF NOT EXISTS idx_users_fb_id ON users(fb_id);

CREATE OR REPLACE TRIGGER update_users_timestamp BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS admins (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);

CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS follows;

DROP TABLE IF EXISTS admins;

DROP TABLE IF EXISTS users;
-- +goose StatementEnd
