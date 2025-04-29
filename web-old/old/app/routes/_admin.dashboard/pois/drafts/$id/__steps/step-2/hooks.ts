import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Draft } from "~/lib/dto";
import { FormInput, schema } from "./schema";

export function useStep2Form(draft: Draft) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: {
        cityId: draft.address?.cityId ?? undefined,
        line1: draft.address?.line1 ?? undefined,
        line2: draft.address?.line2 ?? undefined,
        postalCode: draft.address?.postalCode ?? undefined,
        lat: draft.address?.lat ?? undefined,
        lng: draft.address?.lng ?? undefined,
      },
    },
  });
}
