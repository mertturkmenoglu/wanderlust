import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCategory } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useUpdateCategoryForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateCategoryMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["category-update"],
    mutationFn: async (data: FormInput) => updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
      navigate(`/dashboard/categories/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
