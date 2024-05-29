CREATE TABLE IF NOT EXISTS "cities" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state_id" integer NOT NULL,
	"state_code" text NOT NULL,
	"state_name" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"wiki_data_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"iso2" text NOT NULL,
	"numeric_code" text NOT NULL,
	"phone_code" text NOT NULL,
	"capital" text NOT NULL,
	"currency" text NOT NULL,
	"currency_name" text NOT NULL,
	"currency_symbol" text NOT NULL,
	"tld" text NOT NULL,
	"native" text NOT NULL,
	"region" text NOT NULL,
	"subregion" text NOT NULL,
	"timezones" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "states" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"state_code" text NOT NULL,
	"type" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
