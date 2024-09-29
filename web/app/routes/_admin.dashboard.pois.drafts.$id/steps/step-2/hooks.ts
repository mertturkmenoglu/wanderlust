import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateDraft } from "~/lib/api";
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

export function useStep2Mutation(draft: Draft) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["poi-draft-update", draft.id, "step-2"],
    mutationFn: async (data: FormInput) =>
      updateDraft(draft.id, {
        ...draft,
        ...data,
      }),
    onSuccess: () => {
      toast.success("Draft updated");
      navigate(`/dashboard/pois/drafts/${draft.id}?step=3`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
