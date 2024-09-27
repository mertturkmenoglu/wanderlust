import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUserProfile } from "~/lib/api";
import { UpdateUserProfileRequestDto } from "~/lib/dto";
import { FormInput, schema } from "./schema";

export function useProfileForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useProfileMutation() {
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: async (data: FormInput) => {
      const dto: UpdateUserProfileRequestDto = {
        fullName: data.fullName ?? null,
        gender: data.gender ?? null,
        bio: data.bio ?? null,
        pronouns: data.pronouns ?? null,
        website: data.website ?? null,
        phone: data.phone ?? null,
      };

      return await updateUserProfile(dto);
    },
    onSuccess: async () => {
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}
