ALTER TABLE "events" ADD COLUMN "media" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "media" json DEFAULT '[]'::json NOT NULL;