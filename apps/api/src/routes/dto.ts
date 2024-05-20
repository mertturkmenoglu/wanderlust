import { z } from "zod";

export const validateId = z.object({
  id: z.string().min(1).uuid(),
});
