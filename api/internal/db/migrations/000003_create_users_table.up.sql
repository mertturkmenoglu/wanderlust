CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR (128) UNIQUE NOT NULL,
  username VARCHAR (32) UNIQUE NOT NULL,
  full_name VARCHAR (128) NOT NULL,
  password_hash VARCHAR (255),
  google_id VARCHAR(64) UNIQUE,
  fb_id VARCHAR(64) UNIQUE,
  is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_business_account BOOLEAN DEFAULT FALSE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  role VARCHAR(32) DEFAULT 'user' NOT NULL,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMPTZ,
  login_attempts INT DEFAULT 0,
  lockout_until TIMESTAMPTZ,
  gender VARCHAR(32),
  bio VARCHAR(255),
  pronouns VARCHAR(32),
  website VARCHAR(255),
  phone VARCHAR(32),
  profile_image VARCHAR(128),
  banner_image VARCHAR(128),
  followers_count INT DEFAULT 0 NOT NULL,
  following_count INT DEFAULT 0 NOT NULL,
  last_login TIMESTAMPTZ DEFAULT NOW() NOT NULL,
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
