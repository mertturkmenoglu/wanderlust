CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR (128) UNIQUE NOT NULL,
  username VARCHAR (32) UNIQUE NOT NULL,
  full_name VARCHAR (128) NOT NULL,
  password_hash VARCHAR (255),
  google_id VARCHAR(64) UNIQUE,
  fb_id VARCHAR(64) UNIQUE,
  is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  is_onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_business_account BOOLEAN DEFAULT FALSE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  role VARCHAR(32) DEFAULT 'user' NOT NULL,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMPTZ,
  login_attempts INT DEFAULT 0,
  lockout_until TIMESTAMPTZ,
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

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT 
    fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id SMALLINT PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  image VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  state_code VARCHAR(16) NOT NULL,
  state_name VARCHAR(64) NOT NULL,
  country_code CHAR(2) NOT NULL,
  country_name VARCHAR(64) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description VARCHAR(1024) NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  city_id INT NOT NULL,
  line1 VARCHAR(64) NOT NULL,
  line2 VARCHAR(64),
  postal_code VARCHAR(16),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  CONSTRAINT
    fk_addresses_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  description VARCHAR(512) NOT NULL,
  address_id INT NOT NULL,
  website VARCHAR(255),
  price_level SMALLINT NOT NULL,
  accessibility_level SMALLINT NOT NULL,
  total_votes INT NOT NULL,
  total_points INT NOT NULL,
  total_favorites INT NOT NULL,
  category_id SMALLINT NOT NULL,
  open_times JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_pois_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_pois_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  url VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  media_order SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_media_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE SET DEFAULT
);

CREATE TABLE IF NOT EXISTS amenities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS amenities_pois (
  amenity_id INT NOT NULL,
  poi_id TEXT NOT NULL,
  CONSTRAINT
    fk_amenities_pois_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_amenities_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_bookmarks_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_favorites_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  list_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (collection_id, poi_id),
  CONSTRAINT fk_collection_items_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT fk_collection_items_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT idx_unique_list_index UNIQUE (collection_id, list_index)
);
