import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCity } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useNewCityForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewCityMutation() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["city-create"],
    mutationFn: async (data: FormInput) => createCity(data),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      navigate(`/dashboard/cities`);
      toast.success("City created");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
