import { createInsertSchema } from "drizzle-zod";
import { addresses } from "../../db/schema";

export const createAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});
