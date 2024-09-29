import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateDraft } from "~/lib/api-requests";
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

export function useStep1Mutation(draft: Draft) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["poi-draft-update", draft.id, "step-1"],
    mutationFn: async (data: FormInput) =>
      updateDraft(draft.id, {
        ...draft,
        ...data,
      }),
    onSuccess: () => {
      toast.success("Draft updated");
      navigate(`/dashboard/pois/drafts/${draft.id}?step=2`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
