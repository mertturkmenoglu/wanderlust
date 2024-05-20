import { locations } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";

export const createLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const updateLocationSchema = createInsertSchema(locations)
  .pick({
    accessibilityLevel: true,
    categoryId: true,
    hasWifi: true,
    addressId: true,
    name: true,
    phone: true,
    priceLevel: true,
    website: true,
  })
  .partial();
