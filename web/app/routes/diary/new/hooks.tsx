import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput, schema } from "./schema";

export function useNewDiaryEntryForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}
