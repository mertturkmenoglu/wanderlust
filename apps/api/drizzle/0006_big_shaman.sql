CREATE TABLE IF NOT EXISTS "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country" char(2) NOT NULL,
	"city" text,
	"line1" text NOT NULL,
	"line2" text,
	"postal_code" text,
	"state" text
);
--> statement-breakpoint
DROP TABLE "points";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "location_id" TO "address_id";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_location_id_locations_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "events_location_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "locations_country_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "locations_city_idx";--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "address_id" uuid;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "price_level" smallint;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "accessibility_level" smallint;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_wifi" boolean;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "category_id" "smallserial" NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "updated_at" timestamp (3) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addresses_country_idx" ON "addresses" ("country");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addresses_city_idx" ON "addresses" ("city");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_address_idx" ON "events" ("address_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locations_address_idx" ON "locations" ("address_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locations_category_idx" ON "locations" ("category_id");--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "country";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "line1";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "line2";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "postal_code";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN IF EXISTS "state";