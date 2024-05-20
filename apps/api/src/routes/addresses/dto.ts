import { addresses } from "@/db/schema";

import { createInsertSchema } from "drizzle-zod";

export const createAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});

export const updateAddressSchema = createInsertSchema(addresses)
  .omit({
    id: true,
  })
  .partial();
