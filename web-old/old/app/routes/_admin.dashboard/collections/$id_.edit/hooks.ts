import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCollection } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useUpdateCollectionForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateCollectionMutation(id: string) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["collection-update"],
    mutationFn: async (data: FormInput) => updateCollection(id, data),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["collections"] });
      navigate(`/dashboard/collections/${id}`);
      toast.success("Collection updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
