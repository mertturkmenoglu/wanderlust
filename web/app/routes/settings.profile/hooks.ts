import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, schema } from "./schema";

export function useProfileForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialData,
    },
  });
}

export function useProfileMutation() {
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: async (data: FormInput) => {
      // TODO: Implement later
    },
    onSuccess: async () => {
      toast.success("Profile updated");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}
