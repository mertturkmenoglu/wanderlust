-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS assets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  url TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video')),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  "order" INT NOT NULL DEFAULT 0,

  UNIQUE (entity_type, entity_id, url)
);

CREATE INDEX idx_assets_entity ON assets (entity_type, entity_id);

ALTER TABLE assets
  ADD CONSTRAINT chk_assets_entity_type
  CHECK (entity_type IN (
    'place', 
    'diary',
    'review'
  ));
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS assets;
-- +goose StatementEnd
