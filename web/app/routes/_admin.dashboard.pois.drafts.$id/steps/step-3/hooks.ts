import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateDraft } from "~/lib/api";
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

export function useStep3Mutation(draft: Draft) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["poi-draft-update", draft.id, "step-3"],
    mutationFn: async (data: FormInput) =>
      updateDraft(draft.id, {
        ...draft,
        ...data,
      }),
    onSuccess: () => {
      toast.success("Draft updated");
      navigate(`/dashboard/pois/drafts/${draft.id}?step=4`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
