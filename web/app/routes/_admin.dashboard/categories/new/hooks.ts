import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCategory } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useNewCategoryForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewCategoryMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["category-create"],
    mutationFn: (data: FormInput) => createCategory(data),
    onSuccess: async () => {
      toast.success("Category created");
      navigate("/dashboard/categories");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
