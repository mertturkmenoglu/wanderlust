import { createInsertSchema } from "drizzle-zod";
import { locations } from "../../db/schema";

export const createLocationSchema = createInsertSchema(locations);
