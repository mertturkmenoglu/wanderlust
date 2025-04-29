import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCity } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useUpdateCityForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateCityMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["city-update"],
    mutationFn: async (data: FormInput) => updateCity(id, data),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      navigate(`/dashboard/cities/${id}`);
      toast.success("City updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
