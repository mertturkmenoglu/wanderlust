import { createInsertSchema } from "drizzle-zod";
import { locations } from "../../db/schema";

export const updateLocationSchema = createInsertSchema(locations).pick({
  accessibilityLevel: true,
  categoryId: true,
  hasWifi: true,
  addressId: true,
  name: true,
  phone: true,
  priceLevel: true,
  website: true,
});
