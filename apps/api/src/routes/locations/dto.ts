import { locations } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";

export const createLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const updateLocationSchema = createInsertSchema(locations)
  .omit({
    id: true,
  })
  .partial();
