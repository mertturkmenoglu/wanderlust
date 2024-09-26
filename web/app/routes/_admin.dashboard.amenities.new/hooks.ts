import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAmenity } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useNewAmenityForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useNewAmenityMutation() {
  return useMutation({
    mutationKey: ["amenity-create"],
    mutationFn: (data: FormInput) => createAmenity(data),
    onSuccess: async () => {
      toast.success("Amenity created");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
