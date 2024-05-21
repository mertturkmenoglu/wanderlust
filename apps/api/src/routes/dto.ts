import { z } from "zod";

export const validateId = z.object({
  id: z.string().min(1).uuid(),
});

export const validateUsername = z.object({
  username: z.string().min(1),
});
