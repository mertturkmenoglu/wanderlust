CREATE TABLE IF NOT EXISTS media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  url VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  width INT NOT NULL,
  height INT NOT NULL,
  media_order SMALLINT NOT NULL,
  extension VARCHAR(16) NOT NULL,
  mime_type VARCHAR(64) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_poi_id ON media(poi_id);
