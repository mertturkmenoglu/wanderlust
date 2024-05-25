import { events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
