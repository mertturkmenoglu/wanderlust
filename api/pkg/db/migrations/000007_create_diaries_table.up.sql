CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title VARCHAR(128) NOT NULL,
  description VARCHAR(4096) NOT NULL,
  share_with_friends BOOLEAN NOT NULL DEFAULT false,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_diary_entries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id);

CREATE TABLE IF NOT EXISTS diary_entries_pois (
  diary_entry_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  description VARCHAR(256),
  list_index INT NOT NULL,
  PRIMARY KEY (diary_entry_id, poi_id),
  CONSTRAINT fk_diary_entries_entry FOREIGN KEY (diary_entry_id) REFERENCES diary_entries(id) ON DELETE CASCADE,
  CONSTRAINT fk_diary_entries_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT idx_unique_list_items_diary_pois UNIQUE (diary_entry_id, list_index)
);

CREATE TABLE IF NOT EXISTS diary_entries_users (
  diary_entry_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  list_index INT NOT NULL,
  PRIMARY KEY (diary_entry_id, user_id),
  CONSTRAINT fk_diary_entries_entry FOREIGN KEY (diary_entry_id) REFERENCES diary_entries(id) ON DELETE CASCADE,
  CONSTRAINT fk_diary_entries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT idx_unique_list_items_diary_users UNIQUE (diary_entry_id, list_index)
);

CREATE TABLE IF NOT EXISTS diary_media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  diary_entry_id TEXT NOT NULL,
  url VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  media_order SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_diary_media_diary_entry FOREIGN KEY (diary_entry_id) REFERENCES diary_entries(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_diary_entries ON diary_media(diary_entry_id);
