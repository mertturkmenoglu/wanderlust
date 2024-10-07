import { useNavigate } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCollection } from "~/lib/api";

export function useDeleteCollectionMutation(id: string) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["collection-delete"],
    mutationFn: async () => deleteCollection(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collections"] });
      navigate("/dashboard/collections");
      toast.success("Collection deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
