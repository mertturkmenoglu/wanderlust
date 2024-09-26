import { useNavigate } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCategory } from "~/lib/api";

export function useDeleteCategoryMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["category-delete"],
    mutationFn: async () => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      navigate("/dashboard/categories");
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
