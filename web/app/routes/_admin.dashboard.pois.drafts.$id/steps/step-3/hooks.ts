import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Draft } from "~/lib/dto";
import { FormInput, schema } from "./schema";

export function useStep3Form(draft: Draft) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: draft.amenities ?? undefined,
    },
  });
}
