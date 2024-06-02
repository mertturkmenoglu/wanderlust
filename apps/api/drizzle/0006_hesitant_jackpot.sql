ALTER TABLE "locations" ADD COLUMN "total_votes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "total_points" integer DEFAULT 0 NOT NULL;