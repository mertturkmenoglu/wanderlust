import { createInsertSchema } from "drizzle-zod";
import { points } from "../../db/schema";

export const updatePointSchema = createInsertSchema(points).pick({
  accessibilityLevel: true,
  categoryId: true,
  hasWifi: true,
  locationId: true,
  name: true,
  phone: true,
  priceLevel: true,
  website: true,
});
