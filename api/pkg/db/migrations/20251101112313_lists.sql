-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  user_id TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT 
    fk_lists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lists_user ON lists(user_id);

CREATE TABLE IF NOT EXISTS list_items (
  list_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  PRIMARY KEY (list_id, place_id),
  CONSTRAINT 
    fk_list_items_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_list_items_list FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_list_items_unique UNIQUE (list_id, index)
);
-- +goose StatementEnd

-- +goose Down
DROP TABLE IF EXISTS list_items;

DROP TABLE IF EXISTS lists;
-- +goose StatementBegin
-- +goose StatementEnd
