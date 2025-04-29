import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDraft } from "~/lib/api-requests";

export function useDeletePoiDraftMutation(id: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["poi-draft-delete"],
    mutationFn: async () => deleteDraft(id),
    onSuccess: () => {
      navigate("/dashboard/pois/drafts");
      toast.success("Draft deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
