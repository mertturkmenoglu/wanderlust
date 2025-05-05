import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCollection } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useNewCollectionForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewCollectionMutation() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["collection-create"],
    mutationFn: async (data: FormInput) => createCollection(data),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["collections"] });
      navigate(`/dashboard/collections`);
      toast.success("Collection created");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
