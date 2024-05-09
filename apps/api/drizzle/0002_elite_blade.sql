ALTER TABLE "auths" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auths" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_unique" UNIQUE("user_id");