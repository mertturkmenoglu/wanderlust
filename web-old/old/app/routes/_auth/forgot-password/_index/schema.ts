import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

export type FormInput = z.infer<typeof FormSchema>;
