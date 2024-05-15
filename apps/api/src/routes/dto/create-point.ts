import { createInsertSchema } from "drizzle-zod";
import { points } from "../../db/schema";

export const createPointSchema = createInsertSchema(points);
