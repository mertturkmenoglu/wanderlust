import { events } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const updateEventSchema = createInsertSchema(events)
  .omit({
    id: true,
  })
  .partial();
