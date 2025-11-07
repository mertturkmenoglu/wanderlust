-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "hstore";

CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS update_timestamp;

DROP EXTENSION IF EXISTS "hstore";

DROP EXTENSION IF EXISTS "uuid-ossp";
-- +goose StatementEnd
