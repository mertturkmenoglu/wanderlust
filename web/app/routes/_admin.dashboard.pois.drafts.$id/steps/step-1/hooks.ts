import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Draft } from "~/lib/dto";
import { FormInput, schema } from "./schema";

export function useStep1Form(draft: Draft) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: draft.name ?? undefined,
      description: draft.description ?? undefined,
      phone: draft.phone ?? undefined,
      website: draft.website ?? undefined,
      priceLevel: draft.priceLevel ?? undefined,
      accessibilityLevel: draft.accessibilityLevel ?? undefined,
      categoryId: draft.categoryId ?? undefined,
    },
  });
}
