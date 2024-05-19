import { createInsertSchema } from "drizzle-zod";
import { events } from "../../db/schema";

export const updateEventSchema = createInsertSchema(events).pick({
  description: true,
  startsAt: true,
  endsAt: true,
  website: true,
  priceLevel: true,
  accessibilityLevel: true,
});
