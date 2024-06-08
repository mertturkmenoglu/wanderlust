ALTER TABLE "list_items" ALTER COLUMN "index" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "list_items" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;