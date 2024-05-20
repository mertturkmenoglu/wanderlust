import { createInsertSchema } from "drizzle-zod";
import { addresses } from "../../db/schema";

export const updateAddressSchema = createInsertSchema(addresses)
  .omit({
    id: true,
  })
  .partial();
