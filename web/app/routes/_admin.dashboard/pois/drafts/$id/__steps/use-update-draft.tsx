import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDraft } from "~/lib/api";
import { Draft } from "~/lib/dto";

type TStep = "1" | "2" | "3" | "4" | "5";

export function useUpdateDraftMutation<TForm>(draft: Draft, step: TStep) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["poi-draft", draft.id, "step", step],
    mutationFn: async (data: TForm) =>
      updateDraft(draft.id, {
        ...draft,
        ...data,
      }),
    onSuccess: () => {
      toast.success("Draft updated");
      navigate(`/dashboard/pois/drafts/${draft.id}?step=${+step + 1}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
