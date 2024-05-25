import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { events } from "../../db/schema";

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type CreateEventDto = z.infer<typeof createEventSchema>;

export const updateEventSchema = createInsertSchema(events)
  .omit({
    id: true,
  })
  .partial();

export type UpdateEventDto = z.infer<typeof updateEventSchema>;
