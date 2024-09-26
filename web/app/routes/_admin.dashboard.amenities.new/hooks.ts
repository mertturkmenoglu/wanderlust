import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
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
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["amenity-create"],
    mutationFn: (data: FormInput) => createAmenity(data),
    onSuccess: async () => {
      toast.success("Amenity created");
      navigate("/dashboard/amenities");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
