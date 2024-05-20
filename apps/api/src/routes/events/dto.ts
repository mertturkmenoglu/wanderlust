import { events } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const updateEventSchema = createInsertSchema(events)
  .pick({
    description: true,
    startsAt: true,
    endsAt: true,
    website: true,
    priceLevel: true,
    accessibilityLevel: true,
  })
  .partial();
