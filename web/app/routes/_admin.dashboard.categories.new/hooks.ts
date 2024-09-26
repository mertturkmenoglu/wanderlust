import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput, schema } from "./schema";

export function useNewCategoryForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}
