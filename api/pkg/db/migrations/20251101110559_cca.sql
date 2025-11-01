-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS categories (
  id SMALLINT PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,

  state_code VARCHAR(16) NOT NULL,
  state_name VARCHAR(64) NOT NULL,

  country_code CHAR(2) NOT NULL,
  country_name VARCHAR(64) NOT NULL,

  image TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL
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
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS addresses;

DROP TABLE IF EXISTS cities;

DROP TABLE IF EXISTS categories;
-- +goose StatementEnd
