import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
    mutationFn: async (data: FormInput) =>
      createCity({
        ...data,
        imageLicense: data.imageLicense ?? "",
        imageLicenseLink: data.imageLicenseLink ?? "",
        imageAttribute: data.imageAttribute ?? "",
        imageAttributionLink: data.imageAttributionLink ?? "",
      }),
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
