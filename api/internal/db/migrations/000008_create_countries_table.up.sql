CREATE TABLE IF NOT EXISTS countries (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  iso2 CHAR(2) NOT NULL,
  numeric_code VARCHAR(3) NOT NULL,
  phone_code VARCHAR(32) NOT NULL,
  capital VARCHAR(32) NOT NULL,
  currency CHAR(3) NOT NULL,
  currency_name VARCHAR(64) NOT NULL,
  currency_symbol VARCHAR(10) NOT NULL,
  tld CHAR(3) NOT NULL,
  native VARCHAR(64) NOT NULL,
  region VARCHAR(64) NOT NULL,
  subregion VARCHAR(64) NOT NULL,
  timezones TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);
