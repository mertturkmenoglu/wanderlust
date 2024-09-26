import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAmenity } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useUpdateAmenityForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useUpdateAmenityMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["amenity-update"],
    mutationFn: async (data: FormInput) => updateAmenity(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Amenity updated");
      navigate(`/dashboard/amenities/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
